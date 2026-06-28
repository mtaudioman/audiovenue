'use client'
console.log('register mounted')
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { registerAction } from '../actions/auth.actions'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    name: '', email: '', phone: '', password: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!values.name || values.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errs.email = 'Invalid email address'
    if (!values.password || values.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

 async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const result = await registerAction(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('We sent a verification code to your email')
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          placeholder="John Doe"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Phone (Optional)</label>
        <input
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Min 6 characters"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B8B5A] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
