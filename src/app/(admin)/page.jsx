import { getAllOrders } from '@/modules/orders/services/order.service'
import { getProducts } from '@/modules/products/services/product.service'
import { formatPrice } from '@/modules/products/services/product.service'
import prisma from '@/lib/db'
import Link from 'next/link'
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react'

export default async function AdminPage() {
  const [{ orders, total: totalOrders }, { total: totalProducts }, totalCustomers] =
    await Promise.all([
      getAllOrders({ limit: 5 }),
      getProducts({ status: 'ACTIVE' }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ])

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length
  const confirmedOrders = orders.filter((o) => o.status === 'CONFIRMED').length
  const shippedOrders = orders.filter((o) => o.status === 'SHIPPED').length

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      href: '/admin/orders',
      color: 'blue',
    },
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      href: '/admin/products',
      color: 'purple',
    },
    {
      label: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      href: '/admin/customers',
      color: 'green',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      href: '/admin/orders',
      color: 'yellow',
    },
  ]

  const orderStats = [
    { label: 'Pending', value: pendingOrders, icon: Clock, color: 'yellow' },
    { label: 'Confirmed', value: confirmedOrders, icon: CheckCircle2, color: 'blue' },
    { label: 'Shipped', value: shippedOrders, icon: Truck, color: 'purple' },
  ]

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome to your store dashboard</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <Icon className="w-5 h-5 text-zinc-400 mb-3" />
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Order Status</h2>
        <div className="grid grid-cols-3 gap-4">
          {orderStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center p-4 bg-zinc-50 rounded-xl">
                <Icon className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-zinc-50">
          {orders.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No orders yet</p>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}