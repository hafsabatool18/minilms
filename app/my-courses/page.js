import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/CourseCard'
import EmptyState from '@/components/EmptyState'

export default async function MyCoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'student') redirect('/dashboard')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(
      'created_at, courses(id, title, description, video_url, profiles(full_name))'
    )
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const courses = (enrollments || []).map((e) => e.courses).filter(Boolean)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-all duration-300 hover:gap-2.5 hover:text-brand-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
            My courses
          </h1>
          <p className="mt-1 text-brand-400">
            All the courses you are enrolled in.
          </p>
        </div>

        {courses.length > 0 && (
          <span className="w-fit rounded-full bg-sage-100 px-4 py-1.5 text-sm font-semibold text-sage">
            {courses.length} enrolled
          </span>
        )}
      </div>

      <div className="mt-10">
        {courses.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="You haven't enrolled in any course yet"
            text="Explore the course library, enroll in something you like, and it will appear here."
          >
            <Link href="/courses" className="btn-primary">
              Browse courses
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                teacherName={course.profiles?.full_name || 'Unknown teacher'}
                footer={
                  <Link href={`/courses/${course.id}`} className="btn-outline w-full">
                    Open course
                    <ArrowRight size={16} />
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}