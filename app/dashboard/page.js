import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  Layers,
  PlusCircle,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import StatCard from '@/components/StatCard'
import CourseCard from '@/components/CourseCard'
import EmptyState from '@/components/EmptyState'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const isTeacher = profile?.role === 'teacher'
  const name = profile?.full_name || user.email
  const firstName = name.split(' ')[0]

  /* ---------- Teacher data ---------- */
  let teacherCourses = []
  let countByCourse = {}
  let totalStudents = 0
  let totalEnrollments = 0

  if (isTeacher) {
    const { data } = await supabase
      .from('courses')
      .select('id, title, description, video_url, created_at')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    teacherCourses = data || []
    const ids = teacherCourses.map((c) => c.id)

    if (ids.length > 0) {
      const { data: rows } = await supabase
        .from('enrollments')
        .select('student_id, course_id')
        .in('course_id', ids)

      const enrollments = rows || []
      totalEnrollments = enrollments.length
      totalStudents = new Set(enrollments.map((e) => e.student_id)).size
      enrollments.forEach((e) => {
        countByCourse[e.course_id] = (countByCourse[e.course_id] || 0) + 1
      })
    }
  }

  /* ---------- Student data ---------- */
  let enrolledCourses = []
  let allCoursesCount = 0

  if (!isTeacher) {
    const { data } = await supabase
      .from('enrollments')
      .select(
        'created_at, courses(id, title, description, video_url, profiles(full_name))'
      )
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    enrolledCourses = (data || []).map((e) => e.courses).filter(Boolean)

    const { count } = await supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
    allCoursesCount = count || 0
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* ---------- Welcome banner ---------- */}
      <section className="bg-hero animate-fade-up relative overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_40px_rgba(8,96,95,0.25)] sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold capitalize backdrop-blur">
          <GraduationCap size={14} className="text-olive" />
          {isTeacher ? 'Teacher' : 'Student'} dashboard
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-2 max-w-lg text-white/80">
          {isTeacher
            ? 'Create new courses and see how many students are learning from you.'
            : 'Continue your courses or discover something new to learn today.'}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isTeacher ? (
            <>
              <Link href="/teacher/courses/new" className="btn-olive px-6 py-3">
                <PlusCircle size={18} />
                Add course
              </Link>
              <Link href="/teacher/courses" className="btn-glass px-6 py-3">
                My created courses
              </Link>
            </>
          ) : (
            <>
              <Link href="/courses" className="btn-olive px-6 py-3">
                <Compass size={18} />
                Browse courses
              </Link>
              <Link href="/my-courses" className="btn-glass px-6 py-3">
                My courses
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section
        className="animate-fade-up mt-6 grid gap-4 sm:grid-cols-3"
        style={{ animationDelay: '100ms' }}
      >
        {isTeacher ? (
          <>
            <StatCard icon={BookOpen} label="Total courses" value={teacherCourses.length} />
            <StatCard icon={Users} label="Total students" value={totalStudents} accent />
            <StatCard icon={Layers} label="Total enrollments" value={totalEnrollments} />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} label="Enrolled courses" value={enrolledCourses.length} />
            <StatCard
              icon={Compass}
              label="Still to explore"
              value={Math.max(allCoursesCount - enrolledCourses.length, 0)}
              accent
            />
            <StatCard icon={Layers} label="All courses" value={allCoursesCount} />
          </>
        )}
      </section>

      {/* ---------- Recent courses ---------- */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-900">
            {isTeacher ? 'Your latest courses' : 'Continue learning'}
          </h2>
          <Link
            href={isTeacher ? '/teacher/courses' : '/my-courses'}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all duration-300 hover:gap-2 hover:text-brand-900"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-5">
          {isTeacher ? (
            teacherCourses.length === 0 ? (
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
                {teacherCourses.slice(0, 3).map((course, i) => (
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
            )
          ) : enrolledCourses.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="You haven't enrolled yet"
              text="Pick a course from the library and it will show up here."
            >
              <Link href="/courses" className="btn-primary">
                Browse courses
              </Link>
            </EmptyState>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.slice(0, 3).map((course, i) => (
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
      </section>
    </main>
  )
}