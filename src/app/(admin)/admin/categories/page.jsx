import prisma from '@/src/lib/db'
import CategoryManager from '@/src/modules/admin/components/CategoryManager'

export const metadata = { title: 'Categories | Admin' }

export default async function AdminCategoriesPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
        brand: { select: { id: true, name: true } },
      },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      <CategoryManager categories={categories} brands={brands} />
    </div>
  )
}
