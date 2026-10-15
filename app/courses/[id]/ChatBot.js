'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Bot, Loader2, Send, Sparkles } from 'lucide-react'

const suggestions = [
  'Explain this topic in simple words',
  'Give me a quick summary',
  'What should I learn next?',
]

export default function ChatBot({ courseId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  // Naya message aaye to chat box ke andar neeche scroll ho (poora page nahi)
  useEffect(() => {
    const el = scrollRef.current
    if (el && (messages.length > 0 || loading)) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, loading])

  async function sendMessage(text) {
    const clean = text.trim()
    if (!clean || loading) return

    const newMessages = [...messages, { role: 'user', content: clean }]
    setMessages(newMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, messages: newMessages }),
      })

      const raw = await res.text()
      let data = null
      try {
        data = JSON.parse(raw)
      } catch {
        // jawab JSON nahi tha
      }

      if (!data) {
        setError(`Server returned an unexpected response (status ${res.status}).`)
      } else if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    }

    setLoading(false)
  }

  function handleSend(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section className="card mt-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brand-100 px-5 py-4 sm:px-6">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
          style={{
            backgroundImage:
              'linear-gradient(135deg, var(--brand-900), var(--brand-600))',
          }}
        >
          <Bot size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight text-brand-900">
            AI assistant
          </h2>
          <p className="text-xs text-sage">
            Ask anything about this course's topic
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-100 px-3 py-1 text-xs font-semibold text-brand-900">
          <span className="h-2 w-2 rounded-full bg-olive" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-96 space-y-4 overflow-y-auto bg-brand-50/50 p-4 sm:p-6"
      >
        {messages.length === 0 && !loading && (
          <div className="animate-fade-in flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow">
              <Sparkles size={26} />
            </span>
            <p className="mt-4 text-sm font-semibold text-brand-900">
              Hi! I'm your course assistant.
            </p>
            <p className="mt-1 text-xs text-sage">
              Ask a question or try one of these:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="cursor-pointer rounded-full border border-brand-100 bg-white px-3 py-1.5 text-xs font-medium text-brand-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div
              key={i}
              className={`animate-fade-up flex items-end gap-2 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white">
                  <Bot size={16} />
                </span>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'rounded-br-md bg-brand-600 text-white'
                    : 'rounded-bl-md border border-sage/20 bg-sage-100 text-brand-900'
                }`}
              >
                {m.content}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="animate-fade-in flex items-end gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white">
              <Bot size={16} />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-sage/20 bg-sage-100 px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="animate-typing h-2 w-2 rounded-full bg-brand-400"
                  style={{ animationDelay: `${d * 160}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="animate-fade-in mx-4 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 sm:mx-6">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 sm:p-6"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          maxLength={1000}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="btn-primary h-11 w-11 shrink-0 !p-0"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </section>
  )
}