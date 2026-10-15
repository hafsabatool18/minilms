export default function CoursesLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="skeleton h-6 w-32" />
      <div className="skeleton mt-4 h-10 w-64" />
      <div className="skeleton mt-3 h-4 w-80 max-w-full" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-video w-full rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton mt-4 h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}