'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function enrollInCourse(formData) {
  const courseId = formData.get('courseId')

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase.from('enrollments').insert({
    student_id: user.id,
    course_id: courseId,
  })

  // Agar pehle se enrolled ho to duplicate error aata hai, usay ignore kar dete hain
  if (error && error.code !== '23505') {
    console.error('Enroll error:', error.message)
  }

  revalidatePath('/courses', 'layout')
  revalidatePath('/my-courses')
}