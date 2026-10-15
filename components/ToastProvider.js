'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const styles = {
  success: { icon: CheckCircle2, box: 'bg-olive text-brand-900', border: 'border-olive' },
  error: { icon: AlertCircle, box: 'bg-red-100 text-red-700', border: 'border-red-200' },
  info: { icon: Info, box: 'bg-brand-100 text-brand-900', border: 'border-brand-100' },
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const add = useCallback(
    (type, message) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-3), { id, type, message }])
      setTimeout(() => remove(id), 4000)
    },
    [remove]
  )

  const value = useMemo(
    () => ({
      success: (m) => add('success', m),
      error: (m) => add('error', m),
      info: (m) => add('info', m),
    }),
    [add]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((t) => {
          const s = styles[t.type]
          const Icon = s.icon
          return (
            <div
              key={t.id}
              role="status"
              className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-[0_12px_40px_rgba(8,96,95,0.2)] ${s.border}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.box}`}>
                <Icon size={20} />
              </span>
              <p className="flex-1 pt-1.5 text-sm font-medium text-brand-900">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Close"
                className="cursor-pointer rounded-lg p-1 text-brand-400 transition-colors duration-300 hover:text-brand-900"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}