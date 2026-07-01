import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
// import { usePathname } from 'next/navigation'
import DashboardNav from '@/src/components/layout/DashboardNav'

export const metadata = {
  title: 'Dashboard | Audiovenue',
}

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <DashboardNav user={session.user} />
        </aside>
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
}