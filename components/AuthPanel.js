import { Bot, GraduationCap, PlayCircle, Sparkles } from 'lucide-react'

const points = [
  { icon: PlayCircle, text: 'Watch video courses made by teachers' },
  { icon: Bot, text: 'Ask the AI assistant when you are stuck' },
  { icon: GraduationCap, text: 'Keep all your courses in one place' },
]

export default function AuthPanel({ heading, text }) {
  return (
    <div className="bg-hero relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
        <Sparkles size={16} className="text-olive" />
        MiniLMS
      </span>

      <div>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          {heading}
        </h2>
        <p className="mt-4 max-w-sm text-white/80">{text}</p>

        <ul className="mt-8 space-y-4">
          {points.map((p) => (
            <li key={p.text} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <p.icon size={20} className="text-olive" />
              </span>
              <span className="text-sm text-white/90">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/50">
        Built with Next.js, Supabase and Claude.
      </p>
    </div>
  )
}