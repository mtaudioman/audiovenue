import { auth } from '@/lib/auth'
import { getUserOrders } from '@/modules/orders/services/order.service'
import { formatPrice } from '@/modules/products/services/product.service'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/config/app'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export const metadata = { title: 'My Orders | Audiovenue' }

export default async function OrdersPage() {
  const session = await auth()
  const orders = await getUserOrders(session.user.id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-zinc-50 rounded-2xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
          <p className="font-medium text-zinc-500">You have no orders yet</p>
          <Link
            href="/shop"
            className="inline-block mt-5 bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.orderNumber}`}
              className="block bg-zinc-50 rounded-2xl p-5 hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold">#{order.orderNumber}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${ORDER_STATUS_COLORS[order.status]}-100 text-${ORDER_STATUS_COLORS[order.status]}-700`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <p className="font-bold mt-2">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5">
                    {item.name} × {item.quantity}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-500">
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}