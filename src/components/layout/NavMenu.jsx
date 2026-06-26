'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/config/app'

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#8B8B5A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-0">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3.5 text-sm font-bold tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'bg-[#7a7a4e] text-white'
                    : 'text-white/90 hover:bg-[#7a7a4e] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}