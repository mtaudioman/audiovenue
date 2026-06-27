import prisma from '@/src/lib/db'

export async function findCartByUserId(userId) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function findCartItem(cartId, productId, variantId = null) {
  return prisma.cartItem.findUnique({
    where: {
      cartId_productId_variantId: {
        cartId,
        productId,
        variantId,
      },
    },
  })
}

export async function addCartItem(cartId, productId, variantId, quantity) {
  const existing = await findCartItem(cartId, productId, variantId)

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      variantId,
      quantity,
    },
  })
}

export async function updateCartItemQuantity(itemId, quantity) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: itemId } })
  }
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  })
}

export async function removeCartItem(itemId) {
  return prisma.cartItem.delete({ where: { id: itemId } })
}

export async function clearCart(cartId) {
  return prisma.cartItem.deleteMany({ where: { cartId } })
}