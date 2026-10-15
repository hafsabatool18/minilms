'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  FileText,
  Loader2,
  Type,
  Video,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getYouTubeId } from '@/lib/youtube'
import { useToast } from '@/components/ToastProvider'

export default function NewCoursePage() {
  const router = useRouter()
  const supabase = createClient()
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const previewId = getYouTubeId(videoUrl)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!getYouTubeId(videoUrl)) {
      const msg = 'Please enter a valid YouTube video link.'
      setError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('courses').insert({
      teacher_id: user.id,
      title: title.trim(),
      description: description.trim(),
      video_url: videoUrl.trim(),
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      toast.error(error.message)
      return
    }

    toast.success('Course created successfully!')
    router.push('/teacher/courses')
    router.refresh()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up">
        <Link
          href="/teacher/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-all duration-300 hover:gap-2.5 hover:text-brand-900"
        >
          <ArrowLeft size={16} />
          Back to my courses
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
          Add a new course
        </h1>
        <p className="mt-1 text-brand-400">
          Fill in the details and paste a YouTube link. Your course goes live right away.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card animate-fade-up space-y-5 p-6 sm:p-8 lg:col-span-3"
          style={{ animationDelay: '100ms' }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-900">
              Course title
            </label>
            <div className="relative">
              <Type
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
              />
              <input
                type="text"
                required
                placeholder="e.g. Introduction to JavaScript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-900">
              Description
            </label>
            <div className="relative">
              <FileText
                size={18}
                className="pointer-events-none absolute left-3.5 top-3.5 text-brand-400"
              />
              <textarea
                rows={5}
                required
                placeholder="What will students learn? List the topics, the AI assistant uses this to answer questions."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input resize-none pl-11"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-900">
              YouTube video URL
            </label>
            <div className="relative">
              <Video
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
              />
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="input pl-11"
              />
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
                Saving...
              </>
            ) : (
              'Create course'
            )}
          </button>
        </form>

        {/* Live preview */}
        <aside
          className="animate-fade-up lg:col-span-2"
          style={{ animationDelay: '200ms' }}
        >
          <p className="mb-2 text-sm font-semibold text-sage">Live preview</p>
          <div className="card overflow-hidden lg:sticky lg:top-24">
            <div className="aspect-video w-full overflow-hidden bg-brand-50">
              {previewId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-hero flex h-full w-full items-center justify-center">
                  <BookOpen size={36} className="text-white/80" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="line-clamp-2 text-lg font-bold text-brand-900">
                {title || 'Your course title'}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-brand-400">
                {description || 'Your course description will appear here.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}