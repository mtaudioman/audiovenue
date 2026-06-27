import prisma from '@/lib/db'
import { Users } from 'lucide-react'

export const metadata = { title: 'Customers | Admin' }

export default async function AdminCustomersPage({ searchParams }) {
  const { page, search } = await searchParams
  const skip = (Number(page || 1) - 1) * 20

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
    role: 'CUSTOMER',
  } : { role: 'CUSTOMER' }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-zinc-500 text-sm mt-1">{total} total customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Joined</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <Users className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                  <p className="text-zinc-400">No customers yet</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B8B5A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {customer.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name || 'No name'}</p>
                        <p className="text-xs text-zinc-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {customer.phone || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold">{customer._count.orders}</span>
                    <span className="text-zinc-400 text-xs ml-1">orders</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
