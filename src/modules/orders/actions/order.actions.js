'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth'
import { placeOrder, changeOrderStatus } from '../services/order.service'
import { checkoutSchema } from '../validators/order.validator'

export async function confirmOrderAction(input) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'You must be signed in to place an order' }
    }

    // Never trust the client — re-validate server-side
    const parsed = checkoutSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Please check your details and try again' }
    }

    const { address, paymentMethod, paymentDetails, notes } = parsed.data

    const order = await placeOrder(session.user.id, {
      addressData: address,
      paymentMethod,
      paymentDetails,
      notes,
    })

    revalidatePath('/orders')
    revalidatePath('/dashboard/orders')

    return { success: true, orderNumber: order.orderNumber }
  } catch (error) {
    console.error('Confirm order error:', error)
    // placeOrder throws user-friendly messages (e.g. empty cart)
    return { success: false, error: error.message || 'Failed to place order' }
  }
}

export async function updateOrderStatusAction(id, status) {
  try {
    const session = await auth()
    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
    ) {
      return { success: false, error: 'Unauthorized' }
    }

    await changeOrderStatus(id, status)
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    return { success: true }
  } catch (error) {
    console.error('Update order status error:', error)
    return { success: false, error: 'Failed to update status' }
  }
}