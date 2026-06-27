import { auth } from '@/src/lib/auth'
import { getUserOrders } from '@/src/modules/orders/services/order.service'
import { formatPrice } from '@/src/modules/products/services/product.service'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/src/config/app'
import Link from 'next/link'
import { ShoppingBag, Heart, MapPin, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  const orders = await getUserOrders(session.user.id)

  const totalSpent = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const recentOrders = orders.slice(0, 3)

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      href: '/dashboard/orders',
    },
    {
      label: 'Total Spent',
      value: formatPrice(totalSpent),
      icon: Clock,
      href: '/dashboard/orders',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {session.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-zinc-500 mt-1">Here&apos;s a summary of your account activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-zinc-50 rounded-2xl p-5 hover:bg-zinc-100 transition-colors"
            >
              <Icon className="w-5 h-5 text-zinc-400 mb-3" />
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-zinc-50 rounded-2xl p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-400">No orders yet</p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-sm bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.orderNumber}`}
                className="flex items-center justify-between bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatPrice(order.total)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block bg-${ORDER_STATUS_COLORS[order.status]}-100 text-${ORDER_STATUS_COLORS[order.status]}-700`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-bold text-lg mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors"
          >
            <MapPin className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-800">Manage Profile</span>
          </Link>
          <Link
            href="/dashboard/wishlist"
            className="flex items-center gap-3 bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors"
          >
            <Heart className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-800">My Wishlist</span>
          </Link>
        </div>
      </div>
    </div>
  )
}