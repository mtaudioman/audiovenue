'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import { destroyCloudinaryAssetByUrl } from '@/src/lib/cloudinary.server'
import {
  createNewCategory,
  getCategoryById,
  updateExistingCategory,
  deleteExistingCategory,
} from '../services/category.service'
import { categorySchema } from '../validators/category.validator'

function isAdmin(session) {
  return (
    session?.user &&
    (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN')
  )
}

export async function createCategoryAction(data) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return { success: false, error: 'Unauthorized' }

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const payload = { ...parsed.data, parentId: parsed.data.parentId || null }
    const category = await createNewCategory(payload)
    revalidatePath('/admin/categories')

    return { success: true, category }
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: 'That slug is already in use' }
    }
    console.error('Create category error:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateCategoryAction(id, data) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return { success: false, error: 'Unauthorized' }

    const parsed = categorySchema.partial().safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const payload = { ...parsed.data }
    if ('parentId' in payload) payload.parentId = payload.parentId || null

    const previous = await getCategoryById(id)
    const category = await updateExistingCategory(id, payload)

    if (previous?.image && previous.image !== category.image) {
      await destroyCloudinaryAssetByUrl(previous.image)
    }

    revalidatePath('/admin/categories')

    return { success: true, category }
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: 'That slug is already in use' }
    }
    console.error('Update category error:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategoryAction(id) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return { success: false, error: 'Unauthorized' }

    const category = await getCategoryById(id)
    await deleteExistingCategory(id)
    if (category?.image) {
      await destroyCloudinaryAssetByUrl(category.image)
    }

    revalidatePath('/admin/categories')

    return { success: true }
  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}