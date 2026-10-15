import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

// Key khud process.env.ANTHROPIC_API_KEY se utha leta hai (sirf server par)
const anthropic = new Anthropic()

const MODEL = 'claude-haiku-5-5' // sasta aur tez. Behtar jawab chahiye to 'claude-sonnet-5-5'

export async function POST(request) {
  try {
    const body = await request.json()
    const { courseId, messages } = body

    // 1) Input check
    if (!courseId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Sirf pichle 10 messages, har message 1000 characters tak
    let history = messages
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))

    // Claude ke liye pehla message user ka hona zaroori hai
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift()
    }
    if (history.length === 0) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // 2) Login check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please log in.' }, { status: 401 })
    }

    // 3) Course load karo
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, description, teacher_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
    }

    // 4) Access check: course ka teacher ya enrolled student
    let allowed = course.teacher_id === user.id
    if (!allowed) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', course.id)
        .eq('student_id', user.id)
        .maybeSingle()
      allowed = !!enrollment
    }

    if (!allowed) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course.' },
        { status: 403 }
      )
    }

    // 5) Claude ko bhejo
    const system = `You are a friendly AI teaching assistant for an online course on MiniLMS.

Course title: ${course.title}
Course description: ${course.description}

Rules:
- Only answer questions related to this course's topic and closely related concepts.
- If a question is clearly unrelated, politely say you can only help with this course's topic.
- You cannot watch the course video. You only know the title and description above, so never pretend to know what is said at a specific moment in the video.
- Explain things simply, in short clear paragraphs, like you are teaching a beginner.
- Reply in the same language the student writes in.`

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages: history,
    })

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat error:', err?.message || err)
    return NextResponse.json(
      { error: 'The assistant is unavailable right now. Please try again.' },
      { status: 500 }
    )
  }
}