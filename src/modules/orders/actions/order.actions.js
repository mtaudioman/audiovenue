'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { placeOrder } from '../services/order.service'
import { checkoutSchema } from '../validators/order.validator'

export async function confirmOrderAction(data) {
  try {
    const session = await auth()
    if (!session) {
      return { success: false, error: 'Please login to place an order' }
    }

    const parsed = checkoutSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { address, paymentMethod, paymentDetails, notes } = parsed.data

    const order = await placeOrder(session.user.id, {
      addressData: address,
      paymentMethod,
      paymentDetails,
      notes,
    })

    return { success: true, orderNumber: order.orderNumber }
  } catch (error) {
    console.error('Confirm order error:', error)
    return {
      success: false,
      error: error.message || 'Failed to place order. Please try again.',
    }
  }
}