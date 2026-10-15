import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BookOpen, CheckCircle2, Play, SearchX } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getYouTubeId } from '@/lib/youtube'
import { enrollInCourse } from './actions'
import EnrollButton from '@/components/EnrollButton'

export default async function CoursesPage() {
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

  const isStudent = profile?.role === 'student'

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, description, video_url, profiles(full_name)')
    .order('created_at', { ascending: false })

  // Is student ki enrollments (RLS ki wajah se sirf apni hi milengi)
    const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', user.id)

  const enrolledIds = new Set((enrollments || []).map((e) => e.course_id))

  const total = courses?.length || 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* ---------- Header ---------- */}
      <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            <BookOpen size={14} />
            Course library
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
            All courses
          </h1>
          <p className="mt-1 text-brand-400">
            Pick a course, enroll, and start learning with the AI assistant.
          </p>
        </div>

        {total > 0 && (
          <span className="w-fit rounded-full bg-sage-100 px-4 py-1.5 text-sm font-semibold text-sage">
            {total} {total === 1 ? 'course' : 'courses'} available
          </span>
        )}
      </div>

      {/* ---------- Empty state ---------- */}
      {total === 0 ? (
        <div className="card animate-fade-up mt-10 flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <SearchX size={30} />
          </span>
          <h2 className="mt-5 text-xl font-bold text-brand-900">
            No courses yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-brand-400">
            Teachers haven't published any courses so far. Please check back
            soon, new lessons are on the way!
          </p>
        </div>
      ) : (
        /* ---------- Course grid ---------- */
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => {
            const videoId = getYouTubeId(course.video_url)
            const enrolled = enrolledIds.has(course.id)
            const teacherName = course.profiles?.full_name || 'Unknown teacher'

            return (
              <article
                key={course.id}
                className="card card-hover animate-fade-up group flex flex-col overflow-hidden"
                style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/courses/${course.id}`}
                  className="relative block aspect-video overflow-hidden bg-brand-50"
                >
                  {videoId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="bg-hero flex h-full w-full items-center justify-center">
                      <BookOpen size={36} className="text-white/80" />
                    </div>
                  )}

                  {/* Play overlay */}
                  <span className="absolute inset-0 flex items-center justify-center bg-brand-900/0 transition-all duration-300 group-hover:bg-brand-900/30">
                    <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-brand-900 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>

                  {enrolled && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-olive px-3 py-1 text-xs font-bold text-brand-900 shadow">
                      <CheckCircle2 size={14} />
                      Enrolled
                    </span>
                  )}
                </Link>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/courses/${course.id}`}>
                    <h2 className="line-clamp-2 text-lg font-bold leading-snug text-brand-900 transition-colors duration-300 hover:text-brand-600">
                      {course.title}
                    </h2>
                  </Link>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {teacherName.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-sm text-sage">
                      {teacherName}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-400">
                    {course.description}
                  </p>

                  {/* Action */}
                  <div className="mt-5">
                    {isStudent ? (
                      enrolled ? (
                        <Link
                          href={`/courses/${course.id}`}
                          className="btn-outline w-full"
                        >
                          Open course
                          <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <form action={enrollInCourse}>
                          <input
                            type="hidden"
                            name="courseId"
                            value={course.id}
                          />
                          <EnrollButton className="w-full" />
                        </form>
                      )
                    ) : (
                      <p className="rounded-xl bg-sage-100 px-3 py-2 text-center text-xs font-medium text-sage">
                        Only students can enroll.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}