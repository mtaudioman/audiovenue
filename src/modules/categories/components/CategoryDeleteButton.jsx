'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteCategoryAction } from '../actions/category.actions'

export default function CategoryDeleteButton({ id, name }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onDelete() {
    if (!confirm(`Delete "${name}"? Products in it will become uncategorized.`)) return
    setLoading(true)
    const result = await deleteCategoryAction(id)
    if (result.success) {
      toast.success('Category deleted')
      router.push('/admin/categories')
      router.refresh()
    } else {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <button onClick={onDelete} disabled={loading} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-60">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Delete
    </button>
  )
}