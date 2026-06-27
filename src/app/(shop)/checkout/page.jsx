import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { getCart } from '@/src/modules/cart/services/cart.service'
import CheckoutForm from '@src/modules/orders/components/CheckoutForm'
import { formatPrice } from '@/src/modules/products/services/product.service'
import Image from 'next/image'

export const metadata = {
  title: 'Checkout | Audiovenue',
}

export default async function CheckoutPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const cart = await getCart(session.user.id)
  if (!cart || cart.items.length === 0) redirect('/cart')

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <CheckoutForm user={session.user} />
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-zinc-50 rounded-2xl p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-xs text-zinc-500">{item.variant.value}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-zinc-200">
                <span>Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}