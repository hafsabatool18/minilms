export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="skeleton h-52 w-full rounded-2xl" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card space-y-4 p-5">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-10 w-16" />
          </div>
        ))}
      </div>

      <div className="skeleton mt-10 h-6 w-48" />
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-video w-full rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}