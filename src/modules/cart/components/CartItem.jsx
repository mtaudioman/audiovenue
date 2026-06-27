'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Trash2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { updateCartItemAction, removeFromCartAction } from '../actions/cart.actions'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function CartItem({ item }) {
  const [loading, setLoading] = useState(false)
  const image = item.product.images?.[0]

  async function handleQuantityChange(newQty) {
    if (newQty < 1) return
    setLoading(true)
    const res = await updateCartItemAction(item.id, newQty)
    if (!res.success) toast.error(res.error)
    setLoading(false)
  }

  async function handleRemove() {
    setLoading(true)
    const res = await removeFromCartAction(item.id)
    if (!res.success) toast.error(res.error)
    setLoading(false)
  }

  return (
    <div className={`flex gap-4 py-4 border-b border-zinc-100 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
        {image ? (
          <Image src={image.url} alt={item.product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-zinc-900 text-sm line-clamp-2">{item.product.name}</h4>
        {item.variant && (
          <p className="text-xs text-zinc-500 mt-0.5">{item.variant.name}: {item.variant.value}</p>
        )}
        <p className="text-sm font-bold text-zinc-900 mt-1">{formatPrice(item.unitPrice)}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
            <button onClick={() => handleQuantityChange(item.quantity - 1)} className="p-1.5 hover:bg-zinc-100">
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.quantity + 1)} className="p-1.5 hover:bg-zinc-100">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">{formatPrice(item.total)}</span>
            <button onClick={handleRemove} className="text-zinc-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
