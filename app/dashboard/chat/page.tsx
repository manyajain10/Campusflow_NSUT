'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type Message = { role: 'user' | 'assistant', content: string }

const suggestions = [
  "What do I have due this week?",
  "Any placement drives coming up?",
  "Summarize today's updates",
  "Any conflicts in my schedule?",
  "What club events are happening?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your CampusFlow assistant. Ask me anything about your deadlines, schedule, notices, or campus life at NSUT!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: messageText }])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText }),
    })
    const data = await res.json()
    setLoading(false)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.reply || 'Sorry, something went wrong.'
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Ask Assistant</h1>
      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((s) => (
          <Badge
            key={s}
            variant="outline"
            className="cursor-pointer hover:bg-zinc-700 text-xs"
            onClick={() => sendMessage(s)}
          >
            {s}
          </Badge>
        ))}
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-100'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <CardContent className="border-t p-3 flex gap-2">
          <Input
            placeholder="Ask about your schedule, deadlines, notices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={() => sendMessage()} disabled={loading}>Send</Button>
        </CardContent>
      </Card>
    </div>
  )
}
