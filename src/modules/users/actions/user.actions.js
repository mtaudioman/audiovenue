'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
})

export async function updateProfileAction(data) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const parsed = profileSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
      },
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Update profile error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}