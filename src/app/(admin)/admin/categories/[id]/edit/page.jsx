import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCategories, getCategoryById } from '@/src/modules/categories/services/category.service'
import CategoryForm from '@/src/modules/categories/components/CategoryForm'
import CategoryDeleteButton from '@/src/modules/categories/components/CategoryDeleteButton'

export const metadata = { title: 'Edit Category | Admin' }

export default async function EditCategoryPage({ params }) {
  const { id } = await params
  const [category, categories] = await Promise.all([
    getCategoryById(id),
    getCategories(),
  ])
  if (!category) notFound()

  return (
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to categories
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <CategoryDeleteButton id={category.id} name={category.name} />
      </div>
      <CategoryForm category={category} categories={categories} />
    </div>
  )
}