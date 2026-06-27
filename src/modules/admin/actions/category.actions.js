'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

async function checkAdmin() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
}

export async function createCategoryAction(data) {
  try {
    await checkAdmin()
    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

    const category = await prisma.category.create({
      data: parsed.data,
      include: { _count: { select: { products: true } } },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    return { success: true, category }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateCategoryAction(id, data) {
  try {
    await checkAdmin()
    const parsed = categorySchema.partial().safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    return { success: true, category }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteCategoryAction(id) {
  try {
    await checkAdmin()
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
