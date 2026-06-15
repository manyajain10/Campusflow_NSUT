import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const STUDENT_CONTEXT = `
Student Profile:
- Name: Manya Jain
- Enrollment: 2023UIN3365
- Branch: Information Technology (IT)
- Semester: 6th
- University: NSUT (Netaji Subhas University of Technology), Dwarka, Delhi

Timetable:
- Monday: Networking Devices Lab (CC) 10-12, Digital Forensics Lab (RC-NW) 2-4, Operating System 2-3
- Tuesday: Digital Forensics (5222) 9-10, Compiler Lab (5203) 10-12, Compiler (5119) 2-3, Information Security (5119) 3-4
- Wednesday: Networking Devices (5119) 12-1, Networking Devices Lab (CC) 4-6
- Thursday: Digital Forensics (5222) 9-10, Information Security Lab (CC) 10-12, Networking Devices (5119) 12-1, Information Security (5119) 1-2
- Friday: Information Security (5119) 10-11, Compiler (5119) 11-12, Digital Forensics (5222) 12-1, Compiler (5306) 1-2, Operating System (5119) 2-3

Attendance:
- Compiler: 35/40 = 87.5%
- Information Security: 38/45 = 84.4%
- Digital Forensics: 30/36 = 83.3%
- Networking Devices: 28/33 = 84.8%
- Operating System: 22/26 = 84.6%
- Overall: 153/180 = 85%

Transport from NSUT Dwarka:
- Nearest Metro: Dwarka Mor (Blue Line, 1.8km), Dwarka Sector 14 (Blue Line, 2.2km)
- College Bus Route 4: departs 7:45 AM
- Auto/E-rickshaw available outside main gate
`

export async function POST(request: Request) {
  const { message } = await request.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  // Fetch all campus items
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('due_date', { ascending: true })

  // Fetch all raw sources uploaded by user (Add Source content)
  const { data: sources } = await supabase
    .from('sources')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const today = new Date().toISOString()
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  // Build sources context from Add Source uploads
  const sourcesContext = sources && sources.length > 0
    ? `\nContent uploaded by student via Add Source (WhatsApp, Email, PDF, Notices etc):\n${sources.map((s, i) => `[Source ${i + 1} - ${s.created_at?.slice(0, 10)}]:\n${s.raw_text?.slice(0, 500)}`).join('\n\n')}`
    : ''

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are AcadMate, a helpful AI academic assistant for NSUT students. Today is ${todayDay}, ${today}.

${STUDENT_CONTEXT}

Campus notices and events extracted from NSUT website and Add Source:
${JSON.stringify(items, null, 2)}
${sourcesContext}

Student's question: ${message}

Rules for your response:
- Always respond in clean bullet points using the • symbol
- Never use markdown headers (no # or ## or ###)
- Never use asterisks (* or **) for bold or emphasis
- Use minimal emojis, maximum 2-3 per response only
- Keep each bullet point to 1-2 lines maximum
- Be concise and direct
- No long paragraphs, no horizontal rules, no numbered lists
- Friendly tone like a helpful senior student
- When asked about uploaded content or PDFs, refer to the sources context above
- When asked about today's classes, refer to the timetable for ${todayDay}
- When asked about attendance, give specific numbers and percentages`
    }]
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  await supabase.from('chat_history').insert([
    { user_id: user.id, role: 'user', message },
    { user_id: user.id, role: 'assistant', message: reply },
  ])

  return NextResponse.json({ reply })
}
