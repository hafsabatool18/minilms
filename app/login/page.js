'use client'

import { useState } from 'react'
import { useToast } from '@/components/ToastProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AuthPanel from '@/components/AuthPanel'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
    const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

        if (error) {
      setError(error.message)
      toast.error(error.message)
      return
    }

    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="card animate-fade-up grid w-full max-w-5xl overflow-hidden lg:grid-cols-2">
        <AuthPanel
          heading="Welcome back to your classroom."
          text="Log in to continue your courses and pick up right where you left off."
        />

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-brand-400">
            Log in to your MiniLMS account.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-900">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
                />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-900">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Show or hide password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-brand-400 transition-colors duration-300 hover:text-brand-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-fade-in flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-400">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-brand-600 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}