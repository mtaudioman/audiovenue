
import LoginForm from '@/src/modules/auth/components/LoginForm'
import Link from 'next/link'

export const metadata = {
  title: 'Login | Audio Venue',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">

      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #8B8B5A 0px,
            #8B8B5A 1px,
            transparent 1px,
            transparent 50%
          )`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-light text-white tracking-tight">Audio Venue</h1>
            <p className="text-zinc-400 text-sm mt-1">Bespoke Audio Visual Consultants</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Welcome back</h2>
            <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#8B8B5A] font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/" className="text-zinc-400 text-sm hover:text-white transition-colors">
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
