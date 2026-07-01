'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import { destroyCloudinaryAssetByUrl } from '@/src/lib/cloudinary.server'
import {
  createNewProduct,
  getProductById,
  updateExistingProduct,
  deleteExistingProduct,
} from '../services/product.service'
import { productSchema } from '../validators/product.validator'

function isAdmin(session) {
  return (
    session?.user &&
    (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN')
  )
}

export async function createProductAction(data) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
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
    if (!isAdmin(session)) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = productSchema.partial().safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const previous = await getProductById(id)
    const product = await updateExistingProduct(id, parsed.data)

    const previousUrls = previous?.images?.map((image) => image.url) || []
    const nextUrls = parsed.data.images?.create?.map((image) => image.url) || []
    const removedUrls = previousUrls.filter((url) => !nextUrls.includes(url))

    await Promise.all(removedUrls.map((url) => destroyCloudinaryAssetByUrl(url)))

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
    if (!isAdmin(session)) {
      return { success: false, error: 'Unauthorized' }
    }

    const product = await getProductById(id)
    await deleteExistingProduct(id)
    await Promise.all((product?.images || []).map((image) => destroyCloudinaryAssetByUrl(image.url)))

    revalidatePath('/shop')
    revalidatePath('/admin/products')

    return { success: true }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}