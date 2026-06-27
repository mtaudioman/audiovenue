'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { slugify } from '../services/category.service'
import {
  createCategoryAction,
  updateCategoryAction,
} from '../actions/category.actions'

export default function CategoryForm({ category, categories = [] }) {
  const router = useRouter()
  const isEdit = Boolean(category)
  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(isEdit)

  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    parentId: category?.parentId || '',
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder ?? 0,
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function onNameChange(value) {
    update('name', value)
    if (!slugTouched) update('slug', slugify(value))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, parentId: form.parentId || null }
    const result = isEdit
      ? await updateCategoryAction(category.id, payload)
      : await createCategoryAction(payload)

    if (result.success) {
      toast.success(isEdit ? 'Category updated' : 'Category created')
      router.push('/admin/categories')
      router.refresh()
    } else {
      toast.error(result.error)
      setLoading(false)
    }
  }

  // Don't allow a category to be its own parent
  const parentOptions = categories.filter((c) => c.id !== category?.id)

  const input =
    'w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
        <input value={form.name} onChange={(e) => onNameChange(e.target.value)} className={input} placeholder="Headphones" />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Slug</label>
        <input
          value={form.slug}
          onChange={(e) => { setSlugTouched(true); update('slug', e.target.value) }}
          className={input}
          placeholder="headphones"
        />
        <p className="text-xs text-zinc-400 mt-1">Used in the URL: /shop?category={form.slug || 'slug'}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className={`${input} resize-none`} placeholder="Optional" />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Image URL</label>
        <input value={form.image} onChange={(e) => update('image', e.target.value)} className={input} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Parent category</label>
          <select value={form.parentId} onChange={(e) => update('parentId', e.target.value)} className={input}>
            <option value="">None (top level)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Sort order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} className={input} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} className="w-4 h-4 rounded" />
        <span className="text-sm font-medium text-zinc-700">Active (visible in the store)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create category'}
        </button>
        <button type="button" onClick={() => router.push('/admin/categories')} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 hover:border-zinc-400 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}