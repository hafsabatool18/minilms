export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="card animate-fade-up flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon size={30} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-brand-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-brand-400">{text}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}