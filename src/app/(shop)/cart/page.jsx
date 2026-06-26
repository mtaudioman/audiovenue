import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCart } from '@/modules/cart/services/cart.service'
import CartItem from '@/modules/cart/components/CartItem'
import { formatPrice } from '@/modules/products/services/product.service'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export const metadata = {
  title: 'Cart | Audiovenue',
}

export default async function CartPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const cart = await getCart(session.user.id)

  if (!cart || cart.items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-zinc-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
        >
          Browse Products
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-50 rounded-2xl p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal ({cart.itemCount} items)</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-green-600">Calculated at checkout</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-zinc-900 text-white text-center py-4 rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center text-sm text-zinc-500 hover:text-zinc-700 mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}