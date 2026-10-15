'use client'

import { useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Plus } from 'lucide-react'
import { useToast } from './ToastProvider'

export default function EnrollButton({ className = '' }) {
  const { pending } = useFormStatus()
  const toast = useToast()
  const toastRef = useRef(toast)
  const wasPending = useRef(false)

  useEffect(() => {
    toastRef.current = toast
  })

  useEffect(() => {
    if (pending) {
      wasPending.current = true
    } else if (wasPending.current) {
      wasPending.current = false
      toastRef.current.success("You're enrolled! Find it in My courses.")
    }
  }, [pending])

  // Enroll ke baad ye button page se hat jata hai, tab bhi toast aaye
  useEffect(() => {
    return () => {
      if (wasPending.current) {
        toastRef.current.success("You're enrolled! Find it in My courses.")
      }
    }
  }, [])

  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn-primary ${className}`}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          <Plus size={16} />
          Enroll
        </>
      )}
    </button>
  )
}