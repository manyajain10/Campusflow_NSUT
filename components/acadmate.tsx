'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant', content: string }

const quickQuestions = [
  "What classes do I have today?",
  "What's my attendance in Compiler?",
  "Any exams this week?",
  "Summarise today's notices",
  "Which bus goes from NSUT?",
]

function AvatarIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-11 h-11 text-base', lg: 'w-14 h-14 text-lg' }
  return (
    <div className={`${sizes[size]} rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-md`} style={{ backgroundColor: '#014D4E' }}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background */}
        <rect width="40" height="40" fill="#014D4E"/>
        {/* Body/shoulders */}
        <path d="M6 38 C6 28 14 24 20 24 C26 24 34 28 34 38" fill="#0a6b6c"/>
        {/* Head */}
        <circle cx="20" cy="16" r="9" fill="#f5d0a9"/>
        {/* Hair */}
        <path d="M11 13 C11 7 29 7 29 13 C29 10 26 7 20 7 C14 7 11 10 11 13Z" fill="#3d2106"/>
        {/* Eyes */}
        <circle cx="16.5" cy="15" r="1.2" fill="#3d2106"/>
        <circle cx="23.5" cy="15" r="1.2" fill="#3d2106"/>
        {/* Smile */}
        <path d="M16 19 Q20 22 24 19" stroke="#3d2106" strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Collar */}
        <path d="M16 24 L20 28 L24 24" fill="#ffffff" opacity="0.9"/>
        {/* AI badge */}
        <rect x="26" y="2" width="12" height="8" rx="4" fill="#4ade80"/>
        <text x="32" y="8" textAnchor="middle" fontSize="5" fill="#014D4E" fontWeight="bold">AI</text>
      </svg>
    </div>
  )
}

export default function AcadMate() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey Manya! I'm AcadMate, your personal academic assistant 👋\n• Ask me about your classes, deadlines, or attendance\n• I know your full NSUT schedule and notices\n• Try one of the quick questions below!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const msg = text || input
    if (!msg.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    })
    const data = await res.json()
    setLoading(false)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.reply || 'Something went wrong, try again.'
    }])
  }

  return (
    <>
      {/* Floating button with human avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 h-14 px-4 rounded-2xl flex items-center gap-3 shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
      >
        {open ? (
          <>
            <span className="font-inter font-semibold text-sm">Close</span>
            <span>✕</span>
          </>
        ) : (
          <>
            <AvatarIcon size="sm" />
            <div className="hidden md:block text-left">
              <p className="font-inter font-semibold text-xs leading-none" style={{ color: '#FAF9F6' }}>AcadMate</p>
              <p className="font-inter text-xs leading-none mt-0.5" style={{ color: 'rgba(250,249,246,0.6)' }}>AI Assistant</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75" style={{ backgroundColor: '#4ade80' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#22c55e' }} />
            </span>
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={() => setOpen(false)} />

          <div className="fixed bottom-0 right-0 z-50 w-full md:w-[48%] lg:w-[45%] xl:w-[42%] h-[85vh] md:h-[90vh] md:rounded-tl-3xl flex flex-col overflow-hidden shadow-2xl border-l border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>

            {/* Header with human avatar */}
            <div className="p-5 border-b flex items-center justify-between shrink-0" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
              <div className="flex items-center gap-3">
                <AvatarIcon size="md" />
                <div>
                  <p className="font-playfair font-bold text-base" style={{ color: '#FAF9F6' }}>AcadMate</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4ade80' }} />
                    <p className="font-inter text-xs" style={{ color: 'rgba(250,249,246,0.7)' }}>Your NSUT Academic Assistant</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(250,249,246,0.1)', color: 'rgba(250,249,246,0.7)' }}>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ backgroundColor: '#FAF9F6' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {m.role === 'assistant' && <AvatarIcon size="sm" />}
                  <div
                    className="rounded-2xl px-4 py-3 max-w-[78%] text-sm leading-relaxed whitespace-pre-line font-inter"
                    style={m.role === 'user'
                      ? { backgroundColor: '#014D4E', color: '#FAF9F6', borderRadius: '18px 18px 4px 18px' }
                      : { backgroundColor: '#ffffff', color: '#0a0a0a', border: '1px solid #e0ddd8', borderRadius: '18px 18px 18px 4px' }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start gap-3">
                  <AvatarIcon size="sm" />
                  <div className="rounded-2xl px-4 py-3 border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
                    <div className="flex gap-1.5 items-center">
                      {[0, 150, 300].map(delay => (
                        <span key={delay} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#014D4E', animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-5 pb-3" style={{ backgroundColor: '#FAF9F6' }}>
                <p className="font-inter text-xs mb-2" style={{ color: '#888888' }}>Quick questions:</p>
                <div className="flex gap-2 flex-wrap">
                  {quickQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="font-inter text-xs px-3 py-1.5 rounded-xl border transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#e8f4f4', borderColor: '#014D4E', color: '#014D4E' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t flex gap-3 shrink-0" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask AcadMate anything about NSUT..."
                className="flex-1 px-4 py-3 text-sm font-inter rounded-xl border outline-none transition-all"
                style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8', color: '#0a0a0a' }}
                onFocus={e => e.target.style.borderColor = '#014D4E'}
                onBlur={e => e.target.style.borderColor = '#e0ddd8'}
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-30"
                style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
              >
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
