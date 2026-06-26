import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/layout/AdminNav'

export const metadata = {
  title: 'Admin Panel | Audiovenue',
}

export default async function AdminLayout({ children }) {
  const session = await auth()

  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminNav user={session.user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}