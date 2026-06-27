'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { checkoutSchema } from '../validators/order.validator'
import { confirmOrderAction } from '../actions/order.actions'
import { PAYMENT_METHODS } from '@../config/app'


const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment)
export default function CheckoutForm({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: PAYMENT_METHODS[0].id,
      address: {
        type: 'SHIPPING',
        isDefault: false,
        country: 'United States',
      },
    },
  })

  async function onSubmit(data) {
    setLoading(true)
    try {
      const result = await confirmOrderAction({
        ...data,
        paymentMethod: selectedPayment,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Order placed successfully!')
      router.push(`/orders/${result.orderNumber}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Delivery Address */}
      <div>
        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">First Name</label>
            <input
              {...register('address.firstName')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="daniel"
            />
            {errors.address?.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.address.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Last Name</label>
            <input
              {...register('address.lastName')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="smith"
            />
            {errors.address?.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.address.lastName.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
            <input
              {...register('address.phone')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="+1 555 555 5555"
            />
            {errors.address?.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.address.phone.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1">Street Address</label>
            <input
              {...register('address.street')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="123 Main Street"
            />
            {errors.address?.street && (
              <p className="text-red-500 text-xs mt-1">{errors.address.street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">City</label>
            <input
              {...register('address.city')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="New York"
            />
            {errors.address?.city && (
              <p className="text-red-500 text-xs mt-1">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">State</label>
            <input
              {...register('address.state')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="New York"
            />
            {errors.address?.state && (
              <p className="text-red-500 text-xs mt-1">{errors.address.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Postal Code</label>
            <input
              {...register('address.postalCode')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="10001"
            />
            {errors.address?.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.address.postalCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Country</label>
            <input
              {...register('address.country')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="United States"
            />
            {errors.address?.country && (
              <p className="text-red-500 text-xs mt-1">{errors.address.country.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
                className="sr-only"
              />
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{method.label}</p>
                <p className="text-xs text-zinc-500">{method.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === method.id ? 'border-zinc-900' : 'border-zinc-300'
              }`}>
                {selectedPayment === method.id && (
                  <div className="w-2 h-2 rounded-full bg-zinc-900" />
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Mobile Money / Bank Transfer details */}
       {activeMethod?.requiresReference && (
          <div className="mt-4 space-y-2">
            {activeMethod.payTo && (
              <div className="text-sm bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
                <span className="text-zinc-500">Send payment to: </span>
                <span className="font-semibold">{activeMethod.payTo}</span>
              </div>
            )}
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              {activeMethod.referenceLabel}
            </label>
            <input
              {...register('paymentDetails')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder={activeMethod.referencePlaceholder}
            />
          </div>
        )}
      </div>

      {/* Order Notes */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
          placeholder="Any special instructions for your order or delivery..."
        />
      </div>

      {/* Confirm Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-base hover:bg-zinc-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Placing Order...
          </>
        ) : (
          '✓ Confirm Order'
        )}
      </button>

      <p className="text-xs text-zinc-400 text-center">
        By confirming, you agree to our terms. We will contact you to arrange delivery and payment.
      </p>
    </form>
  )
}