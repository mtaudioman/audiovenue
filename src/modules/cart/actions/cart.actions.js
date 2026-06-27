'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import {
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../services/cart.service'

export async function addToCartAction(productId, variantId = null, quantity = 1) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Please login to add items to cart' }

    await addToCart(session.user.id, productId, variantId, quantity)
    revalidatePath('/cart')

    return { success: true }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

export async function updateCartItemAction(itemId, quantity) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    await updateCartItem(session.user.id, itemId, quantity)
    revalidatePath('/cart')

    return { success: true }
  } catch (error) {
    console.error('Update cart error:', error)
    return { success: false, error: 'Failed to update cart' }
  }
}

export async function removeFromCartAction(itemId) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    await removeFromCart(session.user.id, itemId)
    revalidatePath('/cart')

    return { success: true }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, error: 'Failed to remove item' }
  }
}