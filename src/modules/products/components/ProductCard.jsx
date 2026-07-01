import Image from 'next/image'
import Link from 'next/link'
import {
  formatPrice,
  getDiscountPercentage,
  isOnSale,
} from '../utils/product.utils'

export default function ProductCard({ product }) {
  const primaryImage = product.images?.[0]
  const onSale = isOnSale(product)
  const discount = getDiscountPercentage(product)

  return (
    <div className="group bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">

      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square bg-zinc-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {onSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-zinc-900 text-xs font-semibold px-3 py-1">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-bold text-zinc-900 text-base leading-snug mb-2 group-hover:text-[#8B8B5A] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-[#8B8B5A] font-bold text-lg mb-2">
          {formatPrice(product.price)}
          {onSale && (
            <span className="text-zinc-400 line-through text-sm font-normal ml-2">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </p>

        {product.description && (
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
        )}
      </div>

      {/* Button */}
      <Link
        href={`/shop/${product.slug}`}
        className="block w-full bg-[#8B8B5A] hover:bg-[#7a7a4e] text-white text-center text-sm font-bold tracking-widest uppercase py-3.5 transition-colors"
      >
        More Info
      </Link>
    </div>
  )
}
