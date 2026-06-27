'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { addToCartAction } from '../actions/cart.actions'
import { useCartStore } from '../../../store/cart.store'

export default function AddToCartButton({ productId, stock, variantId = null }) {
  const [loading, setLoading] = useState(false)
  const { openCart } = useCartStore()

  async function handleAddToCart() {
    if (stock === 0) return
    setLoading(true)
    const result = await addToCartAction(productId, variantId, 1)
    if (result.success) {
      toast.success('Added to cart!')
      openCart()
    } else {
      toast.error(result.error || 'Please login to add items to cart')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || stock === 0}
      className="w-full bg-[#8B8B5A] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#7a7a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingBag className="w-5 h-5" />
      )}
      {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
