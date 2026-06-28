import VerifyEmailForm from '@/src/modules/auth/components/VerifyEmailForm'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Verify Email | Audio Venue' }

export default async function VerifyEmailPage({ searchParams }) {
  const { email } = await searchParams
  if (!email) redirect('/register')

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white tracking-tight">Audio Venue</h1>
          <p className="text-zinc-400 text-sm mt-1">Bespoke Audio Visual Consultants</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Verify your email</h2>
            <p className="text-zinc-500 text-sm mt-1">One quick step to activate your account</p>
          </div>
          <VerifyEmailForm email={email} />
          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <Link href="/login" className="text-sm text-[#8B8B5A] font-semibold hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}