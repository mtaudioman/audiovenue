import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { getUserOrders } from '@/src/modules/orders/services/order.service'
import { formatPrice } from '@/src/modules/products/utils/product.utils'
import { ORDER_STATUS_LABELS } from '@/src/config/app'
import Link from 'next/link'
import { ShoppingBag, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await getUserOrders(session.user.id)
  const totalSpent = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <DashboardSidebar user={session.user} />
        </aside>
        <main className="lg:col-span-3 space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {session.user.name?.split(' ')[0]} 👋</h1>
            <p className="text-zinc-500 mt-1">Here&apos;s your account summary.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/orders" className="bg-zinc-50 rounded-2xl p-5 hover:bg-zinc-100 transition-colors">
              <ShoppingBag className="w-5 h-5 text-zinc-400 mb-3" />
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-zinc-500 mt-1">Total Orders</p>
            </Link>
            <Link href="/dashboard/orders" className="bg-zinc-50 rounded-2xl p-5 hover:bg-zinc-100 transition-colors">
              <Clock className="w-5 h-5 text-zinc-400 mb-3" />
              <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
              <p className="text-sm text-zinc-500 mt-1">Total Spent</p>
            </Link>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm text-zinc-500 hover:text-zinc-900">View all →</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="bg-zinc-50 rounded-2xl p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                <p className="text-zinc-400">No orders yet</p>
                <Link href="/shop" className="inline-block mt-4 text-sm bg-zinc-900 text-white px-5 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.orderNumber}`} className="flex items-center justify-between bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatPrice(order.total)}</p>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block bg-yellow-100 text-yellow-700">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardSidebar({ user }) {
  return (
    <div className="bg-zinc-50 rounded-2xl p-4">
      <div className="px-3 py-4 mb-2 border-b border-zinc-200">
        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm mb-2">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <p className="font-semibold text-sm truncate">{user.name}</p>
        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
      </div>
      <nav className="space-y-1 mt-2">
        {[
          { label: 'Overview', href: '/dashboard' },
          { label: 'My Orders', href: '/dashboard/orders' },
          { label: 'Wishlist', href: '/dashboard/wishlist' },
          { label: 'Addresses', href: '/dashboard/addresses' },
          { label: 'Profile', href: '/dashboard/profile' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
