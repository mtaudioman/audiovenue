'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { productSchema } from '../../products/validators/product.validator'
import { createProductAction, updateProductAction } from '../../products/actions/product.actions'
import ImageUpload from '@/src/components/ImageUpload'

export default function ProductForm({ product = null, categories = [], brands = [] }) {
  const router = useRouter()
  const isEdit = !!product
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(product?.images || [])
  const [imageUrl, setImageUrl] = useState('')
  const [variants, setVariants] = useState(product?.variants || [])
  const [variantName, setVariantName] = useState('')
  const [variantValue, setVariantValue] = useState('')
  const [variantPrice, setVariantPrice] = useState('')

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      sku: product.sku || '',
      stock: product.stock,
      lowStockAt: product.lowStockAt,
      weight: product.weight ? Number(product.weight) : undefined,
      status: product.status,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId || '',
    } : {
      status: 'DRAFT',
      isFeatured: false,
      stock: 0,
      lowStockAt: 5,
    },
  })

  const nameValue = useWatch({ control, name: 'name' })

  function generateSlug(name) {
    return name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
  }

  function addImage(url = imageUrl) {
    const normalizedUrl = url?.trim()
    if (!normalizedUrl) return

    setImages((prev) => ([
      ...prev,
      {
        url: normalizedUrl,
        alt: nameValue || '',
        isPrimary: prev.length === 0,
        sortOrder: prev.length,
      },
    ]))
    setImageUrl('')
  }

  function removeImage(index) {
    setImages(images.filter((_, i) => i !== index))
  }

  function setPrimaryImage(index) {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === index })))
  }

  function addVariant() {
    if (!variantName.trim() || !variantValue.trim()) return
    setVariants([...variants, {
      name: variantName.trim(),
      value: variantValue.trim(),
      price: variantPrice ? Number(variantPrice) : null,
      stock: 0,
    }])
    setVariantValue('')
    setVariantPrice('')
  }

  function removeVariant(index) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  async function onSubmit(data) {
    setLoading(true)
    try {
      const normalizedImages = images.map((img, i) => ({
        url: img.url,
        alt: img.alt || '',
        isPrimary: img.isPrimary,
        sortOrder: i,
      }))

      const normalizedVariants = variants.map((variant) => ({
        name: variant.name,
        value: variant.value,
        price: variant.price ?? null,
        stock: Number.isFinite(variant.stock) ? variant.stock : 0,
        sku: variant.sku || null,
      }))

      const payload = {
        ...data,
        slug: data.slug || generateSlug(data.name),
        images: isEdit
          ? {
              deleteMany: {},
              create: normalizedImages,
            }
          : {
              create: normalizedImages,
            },
        variants:
          normalizedVariants.length > 0
            ? isEdit
              ? {
                  deleteMany: {},
                  create: normalizedVariants,
                }
              : {
                  create: normalizedVariants,
                }
            : isEdit
              ? { deleteMany: {} }
              : undefined,
      }

      const result = isEdit
        ? await updateProductAction(product.id, payload)
        : await createProductAction(payload)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5 text-zinc-900">Product Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name *</label>
                <input
                  {...register('name')}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
                  placeholder="e.g. Wilson Audio TuneTot Stand"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Slug *</label>
                <input
                  {...register('slug')}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
                  placeholder="auto-generated-from-name"
                />
                <p className="text-xs text-zinc-400 mt-1">URL-friendly name. Leave blank to auto-generate.</p>
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] resize-none text-zinc-900"
                  placeholder="Describe the product..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full border border-zinc-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Compare Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                  <input
                    {...register('comparePrice', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full border border-zinc-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-1">Shows as strikethrough sale price</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Inventory</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">SKU</label>
                <input
                  {...register('sku')}
                  className="text-zinc-600 w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                  placeholder="AV-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Stock *</label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  className="text-zinc-600 w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Low Stock Alert</label>
                <input
                  {...register('lowStockAt', { valueAsNumber: true })}
                  type="number"
                  className="text-zinc-600 w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5 text-zinc-900">Product Images</h2>
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Image</label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="audiovollum/products"
                />
              </div>
              <button
                type="button"
                onClick={addImage}
                disabled={!imageUrl.trim()}
                className="bg-[#8B8B5A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#7a7a4e] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {images.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Upload an image, then click Add</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-zinc-200 aspect-square">
                    <Image
                      src={img.url}
                      alt={img.alt || 'Product image'}
                      fill
                      className="object-cover"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-1 left-1 bg-[#8B8B5A] text-white text-xs px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(i)}
                          className="text-xs bg-white text-zinc-900 px-2 py-1 rounded font-medium"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-2 text-zinc-900">Variants</h2>
            <p className="text-sm text-zinc-400 mb-4">e.g. Color: Black, Size: Large</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <input
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                placeholder="Name (e.g. Color)"
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
              />
              <input
                type="text"
                value={variantValue}
                onChange={(e) => setVariantValue(e.target.value)}
                placeholder="Value (e.g. Black)"
                className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={variantPrice}
                  onChange={(e) => setVariantPrice(e.target.value)}
                  placeholder="Price (optional)"
                  className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] text-zinc-900"
                />
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-[#8B8B5A] text-white px-3 rounded-lg hover:bg-[#7a7a4e] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2">
                    <span className="text-sm">
                      <span className="font-medium">{v.name}:</span> {v.value}
                      {v.price && <span className="text-zinc-400 ml-2">${v.price}</span>}
                    </span>
                    <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
       {/* Sidebar */}
<div className="space-y-5">

  {/* Status */}
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <h3 className="font-bold mb-4">Status</h3>
    <select
      {...register('status')}
      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
    >
      <option value="DRAFT">Draft</option>
      <option value="ACTIVE">Active</option>
      <option value="ARCHIVED">Archived</option>
      <option value="OUT_OF_STOCK">Out of Stock</option>
    </select>
    <div className="mt-4 flex items-center gap-3">
      <input
        {...register('isFeatured')}
        type="checkbox"
        id="isFeatured"
        className="w-4 h-4 accent-[#8B8B5A]"
      />
      <label htmlFor="isFeatured" className="text-sm font-medium text-zinc-700">
        Featured product
      </label>
    </div>
  </div>

  {/* Brand */}
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <h3 className="font-bold mb-4">Brand</h3>
    <select
      {...register('brandId')}
      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
    >
      <option value="">No brand</option>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>{brand.name}</option>
      ))}
    </select>
  </div>

  {/* Category */}
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <h3 className="font-bold mb-4">Category</h3>
    <select
      {...register('categoryId')}
      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
    >
      <option value="">No category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  </div>

  {/* Submit */}
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-bold hover:bg-zinc-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {isEdit ? 'Update Product' : 'Create Product'}
  </button>

  {isEdit && (
    <button
      type="button"
      onClick={() => router.push('/admin/products')}
      className="w-full border border-zinc-200 text-zinc-600 py-3 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
    >
      Cancel
    </button>
  )}
</div>
      </div>
    </form>
  )
}
