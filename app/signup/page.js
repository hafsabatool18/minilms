'use client'

import { useState } from 'react'
import { useToast } from '@/components/ToastProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AuthPanel from '@/components/AuthPanel'

const roles = [
  {
    value: 'student',
    label: 'Student',
    hint: 'Learn from courses',
    icon: BookOpen,
  },
  {
    value: 'teacher',
    label: 'Teacher',
    hint: 'Create courses',
    icon: GraduationCap,
  },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const toast = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: role },
      },
    })

    setLoading(false)

      if (error) {
      setError(error.message)
      toast.error(error.message)
      return
    }

    toast.success('Account created! Welcome to MiniLMS.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="card animate-fade-up grid w-full max-w-5xl overflow-hidden lg:grid-cols-2">
        <AuthPanel
          heading="Start your learning journey today."
          text="Create a free account as a student or a teacher and get started in under a minute."
        />

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-brand-400">
            Join MiniLMS, it only takes a minute.
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            {/* Role cards */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-900">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => {
                  const selected = role === r.value
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-300 active:scale-95 ${
                        selected
                          ? 'border-brand-600 bg-brand-50 shadow-md'
                          : 'border-brand-100 bg-card hover:border-brand-400'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          selected
                            ? 'bg-brand-600 text-white'
                            : 'bg-brand-50 text-brand-400'
                        }`}
                      >
                        <r.icon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-brand-900">
                          {r.label}
                        </span>
                        <span className="block truncate text-xs text-sage">
                          {r.hint}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-900">
                Full name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input pl-11"
                />
              </div>
            </div>

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
                  minLength={6}
                  placeholder="At least 6 characters"
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
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-600 underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}