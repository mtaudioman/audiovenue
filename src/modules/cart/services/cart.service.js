import {
  findCartByUserId,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../repositories/cart.repository'

export async function getCart(userId) {
  const cart = await findCartByUserId(userId)
  if (!cart) return null

  const items = cart.items.map((item) => {
    const price = item.variant?.price ?? item.product.price
    return {
      ...item,
      unitPrice: price,
      total: price * item.quantity,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    ...cart,
    items,
    subtotal,
    itemCount,
  }
}

export async function addToCart(userId, productId, variantId = null, quantity = 1) {
  const cart = await findCartByUserId(userId)
  if (!cart) throw new Error('Cart not found')

  // Check stock
  const item = await addCartItem(cart.id, productId, variantId, quantity)
  return item
}

export async function updateCartItem(userId, itemId, quantity) {
  const cart = await findCartByUserId(userId)
  if (!cart) throw new Error('Cart not found')

  const belongs = cart.items.find((i) => i.id === itemId)
  if (!belongs) throw new Error('Item not found in cart')

  return updateCartItemQuantity(itemId, quantity)
}

export async function removeFromCart(userId, itemId) {
  const cart = await findCartByUserId(userId)
  if (!cart) throw new Error('Cart not found')

  const belongs = cart.items.find((i) => i.id === itemId)
  if (!belongs) throw new Error('Item not found in cart')

  return removeCartItem(itemId)
}

export async function emptyCart(userId) {
  const cart = await findCartByUserId(userId)
  if (!cart) throw new Error('Cart not found')
  return clearCart(cart.id)
}