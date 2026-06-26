import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'
import { Mail, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-light mb-2">Audio Venue</h2>
            <p className="text-zinc-400 text-sm mb-4">{APP_CONFIG.tagline}</p>
            <div className="space-y-2">
              <a href={`mailto:${APP_CONFIG.contact.email}`} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" />
                {APP_CONFIG.contact.email}
              </a>
              <a href={`tel:${APP_CONFIG.contact.phone}`} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4" />
                {APP_CONFIG.contact.phone}
              </a>
              <span className="flex items-center gap-2 text-zinc-400 text-sm">
                <Clock className="w-4 h-4" />
                {APP_CONFIG.contact.hours}
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-zinc-300">Shop</h3>
            <ul className="space-y-2">
              {['Products', 'Brands', 'Systems', 'Special Offers', 'Trade-Ins'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-zinc-300">Company</h3>
            <ul className="space-y-2">
              {['About', 'Installs', 'Showrooms', 'News', 'Newsletter'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-zinc-300">Account</h3>
            <ul className="space-y-2">
              {[
                { label: 'My Account', href: '/dashboard' },
                { label: 'My Orders', href: '/dashboard/orders' },
                { label: 'Wishlist', href: '/dashboard/wishlist' },
                { label: 'Checkout', href: '/checkout' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Audio Venue. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-zinc-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}