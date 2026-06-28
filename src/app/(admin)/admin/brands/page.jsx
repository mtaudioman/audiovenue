import prisma from '@/src/lib/db'
import BrandManager from '@/src/modules/admin/components/BrandManager'

export const metadata = { title: 'Brands | Admin' }

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true, categories: true } },
      categories: {
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
      </div>
      <BrandManager brands={brands} />
    </div>
  )
}
