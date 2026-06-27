import {
  createOrder,
  findOrderByNumber,
  findOrderById,
  findOrdersByUserId,
  findAllOrders,
  updateOrderStatus,
  updateOrderEmailStatus,
  generateOrderNumber,
} from '../repositories/order.repository'
import { getCart, emptyCart } from '@/src/modules/cart/services/cart.service'
import { sendOrderConfirmationEmails } from '@/src/modules/notifications/services/notification.service'

export async function placeOrder(userId, { addressData, paymentMethod, paymentDetails, notes }) {
  // 1 — Get cart
  const cart = await getCart(userId)
  if (!cart || cart.items.length === 0) {
    throw new Error('Your cart is empty')
  }

  // 2 — Generate order number
  const orderNumber = await generateOrderNumber()

  // 3 — Build order items from cart
  const orderItems = cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    name: item.product.name,
    image: item.product.images?.[0]?.url || null,
    price: Number(item.unitPrice),
    quantity: item.quantity,
    total: Number(item.total),
  }))

  // 4 — Calculate totals
  const subtotal = cart.subtotal
  const shippingCost = 0
  const discount = 0
  const total = subtotal + shippingCost - discount

  // 5 — Create address and order in one transaction
  const order = await createOrder({
    orderNumber,
    userId,
    status: 'PENDING',
    paymentMethod,
    paymentDetails,
    subtotal,
    shippingCost,
    discount,
    total,
    notes,
    address: {
      create: {
        userId,
        ...addressData,
      },
    },
    items: {
      create: orderItems,
    },
  })

  // 6 — Clear the cart
  await emptyCart(userId)

  // 7 — Send confirmation emails
  const emailResults = await sendOrderConfirmationEmails(order)

  // 8 — Update email tracking
  await updateOrderEmailStatus(order.id, {
    customerEmailSentAt: emailResults.customerEmailSent ? new Date() : null,
    adminEmailSentAt: emailResults.adminEmailSent ? new Date() : null,
  })

  return order
}

export function getOrderByNumber(orderNumber) {
  return findOrderByNumber(orderNumber)
}

export function getOrderById(id) {
  return findOrderById(id)
}

export function getUserOrders(userId) {
  return findOrdersByUserId(userId)
}

export function getAllOrders(filters) {
  return findAllOrders(filters)
}

export function changeOrderStatus(id, status) {
  return updateOrderStatus(id, status)
}