import { getProducts } from '@/src/modules/products/services/product.service'
import { formatPrice } from '@/src/modules/products/services/product.service'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'

export const metadata = { title: 'Products | Admin' }

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-zinc-100 text-zinc-600',
  ARCHIVED: 'bg-red-100 text-red-700',
  OUT_OF_STOCK: 'bg-yellow-100 text-yellow-700',
}

export default async function AdminProductsPage({ searchParams }) {
  const { page, search, status } = await searchParams
  const { products, total, pages } = await getProducts({
    page: Number(page) || 1,
    search,
    status: status || undefined,
    limit: 20,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-zinc-500 text-sm mt-1">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-zinc-400">{product.sku || 'No SKU'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={product.stock <= product.lowStockAt ? 'text-red-500 font-medium' : 'text-zinc-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}