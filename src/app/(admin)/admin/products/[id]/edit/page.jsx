import { notFound } from 'next/navigation'
import ProductForm from '@/src/modules/admin/components/ProductForm'
import prisma from '@/src/lib/db'
import { serializeProduct } from '@/src/lib/serialize'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Edit Product | Admin' }

export default async function EditProductPage({ params }) {
  const { id } = await params

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  const serializedProduct = serializeProduct(product)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit: {product.name}</h1>
      </div>
      <ProductForm product={serializedProduct} categories={categories} brands={brands} />
    </div>
  )
}
