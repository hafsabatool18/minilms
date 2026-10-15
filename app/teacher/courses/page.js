import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, BookOpen, PlusCircle, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/CourseCard'
import EmptyState from '@/components/EmptyState'

export default async function TeacherCoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, description, video_url, created_at')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const list = courses || []
  const ids = list.map((c) => c.id)

  const countByCourse = {}
  if (ids.length > 0) {
    const { data: rows } = await supabase
      .from('enrollments')
      .select('course_id')
      .in('course_id', ids)

    ;(rows || []).forEach((e) => {
      countByCourse[e.course_id] = (countByCourse[e.course_id] || 0) + 1
    })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-all duration-300 hover:gap-2.5 hover:text-brand-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
            My created courses
          </h1>
          <p className="mt-1 text-brand-400">
            {list.length} {list.length === 1 ? 'course' : 'courses'} published
          </p>
        </div>

        <Link href="/teacher/courses/new" className="btn-primary w-fit px-6 py-3">
          <PlusCircle size={18} />
          Add course
        </Link>
      </div>

      <div className="mt-10">
        {list.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            text="You haven't created any course so far. Add your first one and students can start learning from you."
          >
            <Link href="/teacher/courses/new" className="btn-primary">
              <PlusCircle size={16} />
              Create your first course
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                footer={
                  <span className="inline-flex items-center gap-2 rounded-full bg-olive-100 px-3 py-1 text-xs font-bold text-brand-900">
                    <Users size={14} />
                    {countByCourse[course.id] || 0} students
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}