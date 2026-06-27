'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '../actions/category.actions'

export default function CategoryManager({ categories: initial }) {
  const [categories, setCategories] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })

  function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleNameChange(name) {
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }))
  }

  async function handleCreate() {
    if (!form.name.trim()) return
    setLoading(true)
    const result = await createCategoryAction(form)
    if (result.success) {
      setCategories([...categories, result.category])
      setForm({ name: '', slug: '', description: '' })
      setShowForm(false)
      toast.success('Category created!')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  async function handleUpdate(id) {
    setLoading(true)
    const result = await updateCategoryAction(id, form)
    if (result.success) {
      setCategories(categories.map((c) => c.id === id ? { ...c, ...form } : c))
      setEditingId(null)
      toast.success('Category updated!')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Products in it will be uncategorized.')) return
    setLoading(true)
    const result = await deleteCategoryAction(id)
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== id))
      toast.success('Category deleted!')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Add New */}
      <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
        <p className="text-sm text-zinc-500">{categories.length} categories</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100">
          <h3 className="font-semibold mb-3">New Category</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Amplifiers"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="amplifiers"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional..."
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-[#8B8B5A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7a7a4e] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Category
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 border border-zinc-200 text-zinc-600 px-4 py-2 rounded-lg text-sm hover:bg-zinc-50"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Name</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Slug</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Products</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-zinc-400 text-sm">
                No categories yet. Add one above.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="border border-zinc-200 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                    />
                  ) : (
                    <p className="font-medium text-sm">{cat.name}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      className="border border-zinc-200 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                    />
                  ) : (
                    <p className="text-sm text-zinc-400">{cat.slug}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-600">{cat._count?.products || 0} products</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          disabled={loading}
                          className="text-xs bg-[#8B8B5A] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#7a7a4e] flex items-center gap-1"
                        >
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs border border-zinc-200 px-3 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(cat)}
                          className="text-zinc-400 hover:text-zinc-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
