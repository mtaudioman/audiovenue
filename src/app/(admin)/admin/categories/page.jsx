import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getCategories } from '@/src/modules/categories/services/category.service'

export const metadata = { title: 'Categories | Admin' }

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-zinc-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new" className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Parent</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Products</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {categories.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-zinc-400">No categories yet</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-zinc-400">/{c.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{c.parent?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{c._count.products}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {c.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/categories/${c.id}/edit`} className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                      <Pencil className="w-3 h-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}