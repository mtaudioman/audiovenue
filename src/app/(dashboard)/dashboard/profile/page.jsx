import { auth } from '@/src/lib/auth'
import ProfileForm from '@/src/modules/users/components/ProfileForm'
import prisma from '@/src/lib/db'

export const metadata = { title: 'Profile | Audiovenue' }

export default async function ProfilePage() {
  const session = await auth()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}