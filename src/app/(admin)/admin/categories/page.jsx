import prisma from '@/lib/db'
import CategoryManager from '@/modules/admin/components/CategoryManager'

export const metadata = { title: 'Categories | Admin' }

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      <CategoryManager categories={categories} />
    </div>
  )
}
