import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getOrderByNumber } from '@/modules/orders/services/order.service'
import { formatPrice } from '@/modules/products/services/product.service'
import { ORDER_STATUS_LABELS } from '@/config/app'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { PAYMENT_METHOD_LABELS } from '@/config/app'

export default async function OrderConfirmationPage({ params }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { orderNumber } = await params
  const order = await getOrderByNumber(orderNumber)

  if (!order || order.userId !== session.user.id) redirect('/dashboard')

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      {/* Success Header */}
      <div className="text-center mb-10">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-zinc-500">
          Thank you {order.user.name}. Your order has been received and a confirmation email has been sent to{' '}
          <span className="font-medium text-zinc-700">{order.user.email}</span>.
        </p>
      </div>

      {/* Order Info */}
      <div className="bg-zinc-50 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Order Number</p>
            <p className="font-bold text-lg">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Status</p>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mt-1">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Payment Method</p>
            <p className="font-medium text-sm mt-1">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Order Total</p>
            <p className="font-bold text-lg">{formatPrice(order.total)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-zinc-50 rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.total)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-zinc-50 rounded-2xl p-6 mb-8">
        <h2 className="font-bold mb-3">Delivery Address</h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          {order.address.firstName} {order.address.lastName}<br />
          {order.address.street}<br />
          {order.address.city}, {order.address.state}<br />
          {order.address.country}<br />
          {order.address.phone && `📞 ${order.address.phone}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/orders"
          className="flex-1 bg-zinc-900 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
        >
          View All Orders
        </Link>
        <Link
          href="/shop"
          className="flex-1 border border-zinc-200 text-zinc-700 text-center py-3.5 rounded-xl font-semibold hover:bg-zinc-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  )
}