import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  getProductBySlug,
  getRelatedProducts,
  calculateAverageRating,
  formatPrice,
  getDiscountPercentage,
  isOnSale,
} from '@/modules/products/services/product.service'
import ProductGrid from '@/modules/products/components/ProductGrid'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Audiovenue`,
    description: product.description,
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(
    product.categoryId,
    product.id,
    4
  )

  const rating = calculateAverageRating(product.reviews)
  const onSale = isOnSale(product)
  const discount = getDiscountPercentage(product)

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                No image
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-sm text-zinc-500 uppercase tracking-wide mb-2">
              {product.category.name}
            </p>
          )}

          <h1 className="text-3xl font-bold text-zinc-900 mb-3">{product.name}</h1>

          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-zinc-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-zinc-500">{rating} ({product.reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {onSale && (
              <>
                <span className="text-xl text-zinc-400 line-through">{formatPrice(product.comparePrice)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-zinc-600 leading-relaxed mb-8">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-700 mb-2">
                {product.variants[0].name}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className="px-4 py-2 border border-zinc-200 rounded-lg text-sm hover:border-zinc-900 transition-colors"
                  >
                    {variant.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-semibold text-base hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2">
            {product.sku && (
              <p className="text-sm text-zinc-400">SKU: {product.sku}</p>
            )}
            <p className="text-sm text-zinc-400">
              Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  )
}