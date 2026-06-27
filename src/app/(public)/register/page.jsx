import RegisterForm from '@/src/modules/auth/components/RegisterForm'
import Link from 'next/link'

export const metadata = {
  title: 'Create Account | Audio Venue',
}

export default function RegisterPage() {
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
            <h2 className="text-2xl font-bold text-zinc-900">Create account</h2>
            <p className="text-zinc-500 text-sm mt-1">Join Audio Venue today</p>
          </div>

          <RegisterForm />

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8B8B5A] font-semibold hover:underline">
                Sign in
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
