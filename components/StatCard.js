export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-sage">{label}</p>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${
            accent ? 'bg-olive text-brand-900' : 'text-white'
          }`}
          style={
            accent
              ? undefined
              : {
                  backgroundImage:
                    'linear-gradient(135deg, var(--brand-900), var(--brand-600))',
                }
          }
        >
          <Icon size={22} />
        </span>
      </div>
      <p className="mt-3 text-4xl font-extrabold tracking-tight text-brand-900">
        {value}
      </p>
    </div>
  )
}