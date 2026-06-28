import Link from 'next/link'



import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/src/modules/categories/services/category.service'
import CategoryForm from '@/src/modules/categories/components/CategoryForm'

export const metadata = { title: 'New Category | Admin' }

export default async function NewCategoryPage() {
  const categories = await getCategories()

  return (
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to categories
      </Link>
      <h1 className="text-2xl font-bold mb-6">New Category</h1>
      <CategoryForm categories={categories} />
    </div>
  )
}