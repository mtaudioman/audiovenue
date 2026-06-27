'use client'

import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../../store/cart.store'
import CartItem from './CartItem'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function CartSidebar({ cart }) {
  const { isOpen, closeCart } = useCartStore()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={closeCart} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-bold text-lg">Your Cart</h2>
            {cart?.itemCount > 0 && (
              <span className="bg-zinc-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-zinc-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-zinc-200 mb-4" />
              <p className="text-zinc-400 font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="mt-4 text-sm text-zinc-600 underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {cart?.items.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-100 space-y-3">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-zinc-900 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-zinc-500 hover:text-zinc-700"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
