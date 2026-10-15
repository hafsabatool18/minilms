export default function CourseLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="skeleton h-4 w-16" />
      <div className="skeleton mt-5 h-10 w-3/4" />
      <div className="skeleton mt-4 h-6 w-48" />

      <div className="card mt-6 p-3">
        <div className="skeleton aspect-video w-full" />
      </div>

      <div className="card mt-6 space-y-3 p-6">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>

      <div className="card mt-6 p-6">
        <div className="skeleton h-72 w-full" />
      </div>
    </main>
  )
}