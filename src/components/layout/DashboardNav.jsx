'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/modules/auth/actions/auth.actions'
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  Heart,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function DashboardNav({ user }) {
  const pathname = usePathname()

  return (
    <div className="bg-zinc-50 rounded-2xl p-4">
      {/* User Info */}
      <div className="px-3 py-4 mb-2 border-b border-zinc-200">
        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm mb-2">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <p className="font-semibold text-sm text-zinc-900 truncate">{user.name}</p>
        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </nav>
    </div>
  )
}