import { getOrderById, changeOrderStatus } from '@/modules/orders/services/order.service'
import { formatPrice } from '@/modules/products/services/product.service'
import { redirect, notFound } from 'next/navigation'
import OrderStatusUpdater from '@/modules/orders/components/OrderStatusUpdater'

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const paymentLabels = {
    CASH_ON_DELIVERY: 'Cash on Delivery',
    MOBILE_MONEY: 'Mobile Money',
    BANK_TRANSFER: 'Bank Transfer',
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold">Items Ordered</h2>
            </div>
            <div className="divide-y divide-zinc-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {Number(order.shippingCost) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-zinc-100">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold mb-4">Update Order Status</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-zinc-500">Customer</h3>
            <p className="font-semibold">{order.user.name}</p>
            <p className="text-sm text-zinc-500">{order.user.email}</p>
            {order.user.phone && (
              <p className="text-sm text-zinc-500">{order.user.phone}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-zinc-500">Delivery Address</h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {order.address?.firstName} {order.address?.lastName}<br />
              {order.address?.street}<br />
              {order.address?.city}, {order.address?.state}<br />
              {order.address?.country}<br />
              {order.address?.phone && `📞 ${order.address.phone}`}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-zinc-500">Payment</h3>
            <p className="text-sm font-medium">{paymentLabels[order.paymentMethod]}</p>
            {order.paymentDetails && (
              <p className="text-sm text-zinc-500 mt-1">{order.paymentDetails}</p>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-zinc-500">Customer Notes</h3>
              <p className="text-sm text-zinc-600">{order.notes}</p>
            </div>
          )}

          {/* Email Status */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-zinc-500">Email Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Customer Email</span>
                <span className={order.customerEmailSentAt ? 'text-green-600 font-medium' : 'text-red-500'}>
                  {order.customerEmailSentAt ? '✓ Sent' : '✗ Not sent'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Admin Email</span>
                <span className={order.adminEmailSentAt ? 'text-green-600 font-medium' : 'text-red-500'}>
                  {order.adminEmailSentAt ? '✓ Sent' : '✗ Not sent'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}