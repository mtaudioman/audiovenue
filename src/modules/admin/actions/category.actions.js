'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import prisma from '@/src/lib/db'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  brandId: z.string().optional().nullable(),
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

    const payload = { ...parsed.data }
    if (!payload.brandId) delete payload.brandId

    const category = await prisma.category.create({
      data: payload,
      include: {
        _count: { select: { products: true } },
        brand: { select: { id: true, name: true } },
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/admin/brands')
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

    const payload = { ...parsed.data }
    if (payload.brandId === '') payload.brandId = null

    const category = await prisma.category.update({
      where: { id },
      data: payload,
      include: { brand: { select: { id: true, name: true } } },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/admin/brands')
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
    revalidatePath('/admin/brands')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
