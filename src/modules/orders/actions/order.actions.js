import { revalidatePath } from 'next/cache'
import { changeOrderStatus } from '../services/order.service'


export async function updateOrderStatusAction(id, status) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
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