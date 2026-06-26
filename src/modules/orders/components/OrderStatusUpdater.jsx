'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateOrderStatusAction } from '../actions/order.actions'

const statuses = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { value: 'PROCESSING', label: 'Processing', color: 'purple' },
  { value: 'SHIPPED', label: 'Shipped', color: 'orange' },
  { value: 'DELIVERED', label: 'Delivered', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
]

export default function OrderStatusUpdater({ orderId, currentStatus }) {
  const [selected, setSelected] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    if (selected === currentStatus) return
    setLoading(true)
    const result = await updateOrderStatusAction(orderId, selected)
    if (result.success) {
      toast.success('Order status updated')
    } else {
      toast.error(result.error)
      setSelected(currentStatus)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelected(status.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
              selected === status.value
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading || selected === currentStatus}
        className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Update Status
      </button>
    </div>
  )
}