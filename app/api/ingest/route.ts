import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { raw_text, source_type } = await request.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  await supabase.from('sources').insert({ user_id: user.id, raw_text })

  const today = new Date().toISOString().split('T')[0]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Today's date is ${today}. Extract campus-related items from this text. Return ONLY a valid JSON array (no markdown, no explanation), where each item has: type (one of: deadline, exam, event, club_event, notice, transport, hostel, placement), title (short, max 8 words), description (1 sentence), due_date (ISO format like 2026-06-15T09:00:00, or null if no date), priority (low/medium/high).

Text:
${raw_text}`
    }]
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]'

  let parsedItems
  try {
    const cleaned = responseText.replace(/```json|```/g, '').trim()
    parsedItems = JSON.parse(cleaned)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to parse AI response', raw: responseText }, { status: 500 })
  }

  const itemsToInsert = parsedItems.map((item: any) => ({
    user_id: user.id,
    type: item.type,
    title: item.title,
    description: item.description,
    due_date: item.due_date,
    priority: item.priority || 'medium',
    source: source_type || 'manual',
  }))

  const { data: inserted, error } = await supabase
    .from('items')
    .insert(itemsToInsert)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Smarter conflict detection - only flag exams/deadlines on same day
  if (inserted) {
    for (const newItem of inserted) {
      if (!newItem.due_date) continue
      if (!['exam', 'deadline', 'placement'].includes(newItem.type)) continue

      const newDate = new Date(newItem.due_date).toDateString()
      const dayStart = new Date(newDate).toISOString()
      const dayEnd = new Date(new Date(newDate).getTime() + 86400000).toISOString()

      const { data: existing } = await supabase
        .from('items')
        .select('*')
        .neq('id', newItem.id)
        .in('type', ['exam', 'deadline', 'placement'])
        .gte('due_date', dayStart)
        .lt('due_date', dayEnd)

      if (existing && existing.length > 0) {
        await supabase.from('items').update({ conflict: true }).eq('id', newItem.id)
        await supabase.from('items').update({ conflict: true }).in('id', existing.map((e: any) => e.id))
      }
    }
  }

  return NextResponse.json({ items: inserted })
}
