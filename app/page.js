import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowRight,
  Bot,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: PlayCircle,
    title: 'Learn from video courses',
    text: 'Watch clear YouTube-based lessons created by teachers, right inside your course page.',
  },
  {
    icon: Bot,
    title: 'Ask the AI assistant',
    text: 'Stuck on a concept? Ask the built-in AI tutor and get simple, beginner-friendly answers.',
  },
  {
    icon: Users,
    title: 'Made for teachers and students',
    text: 'Teachers publish courses in minutes. Students enroll and keep everything in one place.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role
  }

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="bg-hero relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-32 pt-20 text-center sm:px-6 sm:pb-40 sm:pt-28">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <Sparkles size={16} className="text-olive" />
            Learning with an AI assistant
          </span>

          <h1
            className="animate-fade-up mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl"
            style={{ animationDelay: '100ms' }}
          >
            Teach. Learn. Grow with{' '}
            <span className="text-olive">MiniLMS</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-white/80 sm:text-lg"
            style={{ animationDelay: '200ms' }}
          >
            A simple learning platform where teachers share video courses and
            students learn with the help of a smart AI tutor.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '300ms' }}
          >
            {user ? (
              <>
                <Link href="/dashboard" className="btn-olive px-7 py-3">
                  Go to dashboard
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={role === 'teacher' ? '/teacher/courses/new' : '/courses'}
                  className="btn-glass px-7 py-3"
                >
                  {role === 'teacher' ? 'Create a course' : 'Browse courses'}
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className="btn-olive px-7 py-3">
                  Get started free
                  <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-glass px-7 py-3">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Feature cards ---------- */}
      <section className="mx-auto -mt-20 max-w-6xl px-4 sm:-mt-24 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card card-hover animate-fade-up p-6"
              style={{ animationDelay: `${400 + i * 120}ms` }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, var(--brand-900), var(--brand-600))',
                }}
              >
                <f.icon size={24} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-400">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mt-24 bg-brand-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap size={20} className="text-olive" />
            <span className="font-bold">MiniLMS</span>
          </div>
          <p className="text-sm text-white/60">
            Built with Next.js, Supabase and Claude.
          </p>
        </div>
      </footer>
    </main>
  )
}