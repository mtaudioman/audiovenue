'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { registerAction, loginAction } from '../actions/auth.actions'
import { registerSchema } from '../validators/auth.validator'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data) {
    setLoading(true)
    const result = await registerAction(data)

    if (!result.success) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    const loginResult = await loginAction({
      email: data.email,
      password: data.password,
    })

    if (!loginResult.success) {
      toast.success('Account created! Please sign in.')
      router.push('/login')
      return
    }

    toast.success('Account created successfully!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
        <input
          {...register('name')}
          placeholder="John Doe"
          className="text-black w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] transition-colors"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="text-black w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] transition-colors"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number (Optional)</label>
        <input
          {...register('phone')}
          placeholder="+1 (555) 000-0000"
          className="text-black w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 6 characters"
            className="text-black w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] transition-colors pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#8B8B5A] text-white py-3 rounded-xl font-semibold hover:bg-[#7a7a4e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Create Account
      </button>

      <p className="text-xs text-zinc-400 text-center">
        By creating an account you agree to our terms and privacy policy.
      </p>
    </form>
  )
}
