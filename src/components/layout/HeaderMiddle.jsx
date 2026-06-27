'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../store/cart.store'
import { APP_CONFIG } from '../../config/app'

export default function HeaderMiddle({ cartItemCount = 0 }) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { openCart } = useCartStore()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <div className="bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between gap-8">

        <Link href="/" className="flex-shrink-0">
          <h1 className="text-4xl font-light text-zinc-900 tracking-tight leading-none">
            Audio Venue
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5 tracking-wide">
            {APP_CONFIG.tagline}
          </p>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search our products..."
            className="flex-1 border border-zinc-200 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B8B5A] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#8B8B5A] hover:bg-[#7a7a4e] text-white px-5 py-2.5 rounded-r-lg text-sm font-bold tracking-wider transition-colors"
          >
            GO
          </button>
        </form>

        <button
          onClick={openCart}
          className="flex-shrink-0 flex items-center gap-3 border border-zinc-200 rounded-lg px-5 py-3 hover:border-zinc-400 transition-colors group"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-zinc-700 group-hover:text-zinc-900 transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8B8B5A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-700">
            £0.00
          </span>
        </button>
      </div>
    </div>
  )
}
