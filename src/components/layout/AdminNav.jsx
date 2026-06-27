'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '../../modules/auth/actions/auth.actions'
import { LayoutDashboard, ShoppingBag, Package, Tag, Users, LogOut, Store } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
]

export default function AdminNav({ user }) {
  const pathname = usePathname()

  return (
    <header className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
              <Store className="w-5 h-5" />
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">← View Store</Link>
            <span className="text-xs text-zinc-500">{user.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
