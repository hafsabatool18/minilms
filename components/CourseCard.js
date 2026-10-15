import Link from 'next/link'
import { BookOpen, Play } from 'lucide-react'
import { getYouTubeId } from '@/lib/youtube'

export default function CourseCard({ course, teacherName, footer, index = 0 }) {
  const videoId = getYouTubeId(course.video_url)

  return (
    <article
      className="card card-hover animate-fade-up group flex flex-col overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
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
        <span className="absolute inset-0 flex items-center justify-center bg-brand-900/0 transition-all duration-300 group-hover:bg-brand-900/30">
          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-brand-900 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Play size={20} className="ml-0.5" fill="currentColor" />
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/courses/${course.id}`}>
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-brand-900 transition-colors duration-300 hover:text-brand-600">
            {course.title}
          </h2>
        </Link>

        {teacherName && (
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {teacherName.charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-sm text-sage">{teacherName}</span>
          </div>
        )}

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-brand-400">
          {course.description}
        </p>

        {footer && <div className="mt-5">{footer}</div>}
      </div>
    </article>
  )
}