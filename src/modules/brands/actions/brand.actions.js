'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import prisma from '@/src/lib/db'
import { destroyCloudinaryAssetByUrl } from '@/src/lib/cloudinary.server'
import { z } from 'zod'

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

async function checkAdmin() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized')
  }
}

export async function createBrandAction(data) {
  try {
    await checkAdmin()
    const parsed = brandSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

    const brand = await prisma.brand.create({
      data: parsed.data,
      include: { _count: { select: { products: true, categories: true } }, categories: true },
    })

    revalidatePath('/admin/brands')
    revalidatePath('/brands')
    return { success: true, brand }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateBrandAction(id, data) {
  try {
    await checkAdmin()
    const parsed = brandSchema.partial().safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

    const previous = await prisma.brand.findUnique({ where: { id }, select: { logo: true } })
    const brand = await prisma.brand.update({ where: { id }, data: parsed.data })

    if (previous?.logo && previous.logo !== brand.logo) {
      await destroyCloudinaryAssetByUrl(previous.logo)
    }

    revalidatePath('/admin/brands')
    revalidatePath('/brands')
    return { success: true, brand }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteBrandAction(id) {
  try {
    await checkAdmin()
    const brand = await prisma.brand.findUnique({ where: { id }, select: { logo: true } })
    await prisma.brand.delete({ where: { id } })

    if (brand?.logo) {
      await destroyCloudinaryAssetByUrl(brand.logo)
    }

    revalidatePath('/admin/brands')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
