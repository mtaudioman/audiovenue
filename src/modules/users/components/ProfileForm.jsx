'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateProfileAction } from '@/src/modules/users/actions/user.actions'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

export default function ProfileForm({ user }) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
    },
  })

  async function onSubmit(data) {
    setLoading(true)
    const result = await updateProfileAction(data)
    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-zinc-50 rounded-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
          <input
            {...register('name')}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
          <input
            value={user.email}
            disabled
            className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
          <input
            {...register('phone')}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            placeholder="+237 6XX XXX XXX"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </form>
    </div>
  )
}