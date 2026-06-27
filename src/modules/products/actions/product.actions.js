'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import {
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
} from '../services/product.service'
import { productSchema } from '../validators/product.validator'

export async function createProductAction(data) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = productSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const product = await createNewProduct(parsed.data)
    revalidatePath('/shop')
    revalidatePath('/admin/products')

    return { success: true, product }
  } catch (error) {
    console.error('Create product error:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProductAction(id, data) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = productSchema.partial().safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const product = await updateExistingProduct(id, parsed.data)
    revalidatePath('/shop')
    revalidatePath(`/shop/${data.slug}`)
    revalidatePath('/admin/products')

    return { success: true, product }
  } catch (error) {
    console.error('Update product error:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProductAction(id) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' }
    }

    await deleteExistingProduct(id)
    revalidatePath('/shop')
    revalidatePath('/admin/products')

    return { success: true }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}