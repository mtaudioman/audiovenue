'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2, X, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { createBrandAction, updateBrandAction, deleteBrandAction } from '@/src/modules/brands/actions/brand.actions'
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '../actions/category.actions'
import ImageUpload from '@/src/components/ImageUpload'

export default function BrandManager({ brands: initial }) {
  const [brands, setBrands] = useState(initial)
  const [expandedBrand, setExpandedBrand] = useState(null)
  const [showBrandForm, setShowBrandForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  const [brandForm, setBrandForm] = useState({
    name: '', slug: '', description: '', logo: '', website: '',
    isActive: true, isFeatured: false,
  })

  const [catForm, setCatForm] = useState({
    name: '', slug: '', description: '', brandId: '',
  })

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // ── Brand CRUD ──────────────────────────────

  async function handleCreateBrand() {
    if (!brandForm.name.trim()) return
    setLoading(true)
    const result = await createBrandAction(brandForm)
    if (result.success) {
      setBrands([...brands, { ...result.brand, categories: [] }])
      setBrandForm({ name: '', slug: '', description: '', logo: '', website: '', isActive: true, isFeatured: false })
      setShowBrandForm(false)
      toast.success('Brand created!')
    } else toast.error(result.error)
    setLoading(false)
  }

  async function handleUpdateBrand(id) {
    setLoading(true)
    const result = await updateBrandAction(id, brandForm)
    if (result.success) {
      setBrands(brands.map((b) => b.id === id ? { ...b, ...brandForm } : b))
      setEditingBrand(null)
      toast.success('Brand updated!')
    } else toast.error(result.error)
    setLoading(false)
  }

  async function handleDeleteBrand(id) {
    if (!confirm('Delete this brand? All categories under it will be unlinked.')) return
    setLoading(true)
    const result = await deleteBrandAction(id)
    if (result.success) {
      setBrands(brands.filter((b) => b.id !== id))
      toast.success('Brand deleted!')
    } else toast.error(result.error)
    setLoading(false)
  }

  function startEditBrand(brand) {
    setEditingBrand(brand.id)
    setBrandForm({
      name: brand.name, slug: brand.slug,
      description: brand.description || '',
      logo: brand.logo || '', website: brand.website || '',
      isActive: brand.isActive, isFeatured: brand.isFeatured,
    })
  }

  //  Category CRUD 

  async function handleCreateCategory(brandId) {
    if (!catForm.name.trim()) return
    setLoading(true)
    const result = await createCategoryAction({ ...catForm, brandId })
    if (result.success) {
      setBrands(brands.map((b) =>
        b.id === brandId
          ? { ...b, categories: [...b.categories, { ...result.category, _count: { products: 0 } }] }
          : b
      ))
      setCatForm({ name: '', slug: '', description: '', brandId: '' })
      setShowCategoryForm(null)
      toast.success('Category created!')
    } else toast.error(result.error)
    setLoading(false)
  }

  async function handleUpdateCategory(catId, brandId) {
    setLoading(true)
    const result = await updateCategoryAction(catId, catForm)
    if (result.success) {
      setBrands(brands.map((b) =>
        b.id === brandId
          ? { ...b, categories: b.categories.map((c) => c.id === catId ? { ...c, ...catForm } : c) }
          : b
      ))
      setEditingCategory(null)
      toast.success('Category updated!')
    } else toast.error(result.error)
    setLoading(false)
  }

  async function handleDeleteCategory(catId, brandId) {
    if (!confirm('Delete this category?')) return
    setLoading(true)
    const result = await deleteCategoryAction(catId)
    if (result.success) {
      setBrands(brands.map((b) =>
        b.id === brandId
          ? { ...b, categories: b.categories.filter((c) => c.id !== catId) }
          : b
      ))
      toast.success('Category deleted!')
    } else toast.error(result.error)
    setLoading(false)
  }

  function startEditCategory(cat) {
    setEditingCategory(cat.id)
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '' })
  }

  return (
    <div className="space-y-4">

      {/* Add Brand Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowBrandForm(!showBrandForm)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Create Brand Form */}
      {showBrandForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-[#8B8B5A]">
          <h3 className="font-bold text-lg mb-4">New Brand</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Brand Name *</label>
              <input
                value={brandForm.name}
                onChange={(e) => setBrandForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="e.g. Wilson Audio"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Slug *</label>
              <input
                value={brandForm.slug}
                onChange={(e) => setBrandForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="wilson-audio"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Logo</label>
              <ImageUpload
                value={brandForm.logo}
                onChange={(url) => setBrandForm((f) => ({ ...f, logo: url }))}
                folder="audiovollum/brands"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Website</label>
              <input
                value={brandForm.website}
                onChange={(e) => setBrandForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://wilsonaudio.com"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
              <textarea
                value={brandForm.description}
                onChange={(e) => setBrandForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="About this brand..."
                className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] resize-none"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brandForm.isActive}
                  onChange={(e) => setBrandForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="accent-[#8B8B5A]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brandForm.isFeatured}
                  onChange={(e) => setBrandForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="accent-[#8B8B5A]"
                />
                Featured
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateBrand}
              disabled={loading}
              className="flex items-center gap-2 bg-[#8B8B5A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7a7a4e] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Brand
            </button>
            <button onClick={() => setShowBrandForm(false)} className="flex items-center gap-2 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Brand List */}
      {brands.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-zinc-400">No brands yet. Add your first brand above.</p>
        </div>
      ) : (
        brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Brand Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  {expandedBrand === brand.id
                    ? <ChevronDown className="w-5 h-5" />
                    : <ChevronRight className="w-5 h-5" />
                  }
                </button>

                {brand.logo && (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain rounded"
                  />
                )}

                {editingBrand === brand.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={brandForm.name}
                      onChange={(e) => setBrandForm((f) => ({ ...f, name: e.target.value }))}
                      className="border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                    />
                    <input
                      value={brandForm.slug}
                      onChange={(e) => setBrandForm((f) => ({ ...f, slug: e.target.value }))}
                      className="border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] w-32"
                      placeholder="slug"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{brand.name}</span>
                      {brand.isFeatured && (
                        <span className="text-xs bg-[#8B8B5A] text-white px-2 py-0.5 rounded-full">Featured</span>
                      )}
                      {!brand.isActive && (
                        <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      {brand._count.categories} categories · {brand._count.products} products
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingBrand === brand.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateBrand(brand.id)}
                      disabled={loading}
                      className="text-xs bg-[#8B8B5A] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#7a7a4e]"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save
                    </button>
                    <button onClick={() => setEditingBrand(null)} className="text-xs border border-zinc-200 px-3 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-50">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditBrand(brand)} className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteBrand(brand.id)} className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Categories (expanded) */}
            {expandedBrand === brand.id && (
              <div className="px-6 py-4 bg-zinc-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-zinc-600">Categories</p>
                  <button
                    onClick={() => {
                      setShowCategoryForm(brand.id)
                      setCatForm({ name: '', slug: '', description: '' })
                    }}
                    className="flex items-center gap-1 text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Category
                  </button>
                </div>

                {/* Category Form */}
                {showCategoryForm === brand.id && (
                  <div className="bg-white rounded-xl p-4 mb-3 border border-zinc-200">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Name *</label>
                        <input
                          value={catForm.name}
                          onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                          placeholder="e.g. Speakers"
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Slug *</label>
                        <input
                          value={catForm.slug}
                          onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
                          placeholder="speakers"
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                        <input
                          value={catForm.description}
                          onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Optional"
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateCategory(brand.id)}
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-[#8B8B5A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#7a7a4e] disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Save
                      </button>
                      <button onClick={() => setShowCategoryForm(null)} className="flex items-center gap-1.5 border border-zinc-200 px-4 py-2 rounded-lg text-xs text-zinc-500 hover:bg-zinc-50">
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Category List */}
                {brand.categories.length === 0 ? (
                  <p className="text-sm text-zinc-400 text-center py-4">No categories yet</p>
                ) : (
                  <div className="space-y-2">
                    {brand.categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-zinc-100">
                        {editingCategory === cat.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              value={catForm.name}
                              onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                              className="border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] w-32"
                            />
                            <input
                              value={catForm.slug}
                              onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
                              className="border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] w-28"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B8B5A]" />
                            <div>
                              <p className="text-sm font-medium">{cat.name}</p>
                              <p className="text-xs text-zinc-400">{cat._count?.products || 0} products · /{cat.slug}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {editingCategory === cat.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateCategory(cat.id, brand.id)}
                                disabled={loading}
                                className="text-xs bg-[#8B8B5A] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#7a7a4e]"
                              >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                Save
                              </button>
                              <button onClick={() => setEditingCategory(null)} className="text-xs border border-zinc-200 px-3 py-1.5 rounded-lg text-zinc-500">
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditCategory(cat)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-100">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteCategory(cat.id, brand.id)} className="text-zinc-400 hover:text-red-500 p-1 rounded hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
