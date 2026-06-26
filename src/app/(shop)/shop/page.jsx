import { getProducts } from '@/modules/products/services/product.service'
import ProductGrid from '@/modules/products/components/ProductGrid'

export const metadata = {
  title: 'Shop | Audiovenue',
  description: 'Browse our collection of premium audio equipment',
}

export default async function ShopPage({ searchParams }) {
  const { page, category, search, sort } = await searchParams

  const { products, total, pages } = await getProducts({
    page: Number(page) || 1,
    category,
    search,
    sort: sort || 'createdAt',
  })

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Shop</h1>
        <p className="text-zinc-500 mt-1">{total} products available</p>
      </div>

      <ProductGrid products={products} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/shop?page=${p}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                Number(page) === p || (!page && p === 1)
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}