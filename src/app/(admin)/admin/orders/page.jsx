import { getAllOrders } from '@/modules/orders/services/order.service'
import { formatPrice } from '@/modules/products/services/product.service'
import Link from 'next/link'

export const metadata = { title: 'Orders | Admin' }

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const paymentLabels = {
  CASH_ON_DELIVERY: 'Cash on Delivery',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
}

export default async function AdminOrdersPage({ searchParams }) {
  const { status, page } = await searchParams
  const { orders, total, pages } = await getAllOrders({
    status,
    page: Number(page) || 1,
  })

  const statuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-zinc-500 text-sm">{total} total orders</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/admin/orders"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !status ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === s ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-zinc-400">{order.items.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{order.user?.name}</p>
                      <p className="text-xs text-zinc-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-600">{paymentLabels[order.paymentMethod]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 px-6 py-4 border-t border-zinc-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/orders?page=${p}${status ? `&status=${status}` : ''}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  Number(page) === p || (!page && p === 1)
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}