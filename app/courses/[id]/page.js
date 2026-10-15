import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2, FileText, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getYouTubeId } from '@/lib/youtube'
import { enrollInCourse } from '../actions'
import EnrollButton from '@/components/EnrollButton'
import ChatBot from './ChatBot'

export default async function CoursePage({ params }) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, description, video_url, teacher_id, profiles(full_name)')
    .eq('id', id)
    .single()

  if (!course) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStudent = profile?.role === 'student'
  const isOwner = course.teacher_id === user.id

  let enrolled = false
  if (isStudent) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', course.id)
      .eq('student_id', user.id)
      .maybeSingle()
    enrolled = !!enrollment
  }

  const canWatch = isOwner || enrolled
  const videoId = getYouTubeId(course.video_url)
  const teacherName = course.profiles?.full_name || 'Unknown teacher'

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* ---------- Header ---------- */}
      <div className="animate-fade-up">
        <Link
          href={isStudent ? '/my-courses' : '/teacher/courses'}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-all duration-300 hover:gap-2.5 hover:text-brand-900"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
            {course.title}
          </h1>
          {enrolled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-olive px-3 py-1 text-xs font-bold text-brand-900">
              <CheckCircle2 size={14} />
              Enrolled
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {teacherName.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm text-sage">
            Taught by <b className="font-semibold text-brand-900">{teacherName}</b>
          </span>
        </div>
      </div>

      {/* ---------- Video card ---------- */}
      <div
        className="animate-fade-up mt-6"
        style={{ animationDelay: '100ms' }}
      >
        {canWatch ? (
          videoId ? (
            <div className="card overflow-hidden p-2 sm:p-3">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-brand-900">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center text-sm font-medium text-red-700">
              This course has an invalid video link.
            </div>
          )
        ) : (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Lock size={28} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-brand-900">
              This lesson is locked
            </h2>
            <p className="mt-2 max-w-sm text-sm text-brand-400">
              {isStudent
                ? 'Enroll in this course to watch the video and chat with the AI assistant.'
                : 'Only enrolled students can watch this course.'}
            </p>
            {isStudent && (
              <form action={enrollInCourse} className="mt-6">
                <input type="hidden" name="courseId" value={course.id} />
                <EnrollButton className="px-8" />
              </form>
            )}
          </div>
        )}
      </div>

      {/* ---------- About ---------- */}
      <section
        className="card animate-fade-up mt-6 p-6"
        style={{ animationDelay: '200ms' }}
      >
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-900">
          <FileText size={20} className="text-brand-600" />
          About this course
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-400">
          {course.description}
        </p>
      </section>

      {/* ---------- AI chatbot ---------- */}
      {canWatch && (
        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <ChatBot courseId={course.id} />
        </div>
      )}
    </main>
  )
}