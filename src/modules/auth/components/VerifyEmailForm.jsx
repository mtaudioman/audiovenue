'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { verifyEmailAction, resendCodeAction } from '../actions/auth.actions'

export default function VerifyEmailForm({ email }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const result = await verifyEmailAction({ email, code })
    if (result.success) {
      toast.success('Email verified! Please sign in.')
      router.push('/login')
    } else {
      toast.error(result.error)
      setLoading(false)
    }
  }

  async function onResend() {
    setCooldown(30)
    const result = await resendCodeAction(email)
    result.success ? toast.success('New code sent') : toast.error(result.error)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-sm text-zinc-500">
        Enter the 6-digit code we sent to <span className="font-medium text-zinc-800">{email}</span>.
      </p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="••••••"
        className="w-full text-center tracking-[0.5em] text-2xl font-semibold border border-zinc-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B8B5A]"
      />
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full bg-[#8B8B5A] text-white py-3 rounded-xl font-semibold hover:bg-[#7a7a4e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Verify Email
      </button>
      <button
        type="button"
        onClick={onResend}
        disabled={cooldown > 0}
        className="w-full text-sm text-zinc-500 hover:text-zinc-800 disabled:opacity-50"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
    </form>
  )
}