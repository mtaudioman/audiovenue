import ProductForm from '@/src/modules/admin/components/ProductForm'
import prisma from '@/src/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Add Product | Admin' }

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
