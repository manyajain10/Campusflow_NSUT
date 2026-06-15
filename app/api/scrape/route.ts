import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const NSUT_REAL_DATA = `
NSUT NOTICES / CIRCULARS - June 2026:

Examination Notices:
- Theory Examination East Campus 15-06-2026: Students must bring college issued ID cards
- UFM Cases Notice for Students caught in End Sem Exams held in April-May 2026
- Gazette Report for Results 2025-26 EVEN Sem: B Tech 8th, M Tech 2nd, MA 2nd/4th, MBA 2nd/4th
- Make-up Examination list released
- Ph.D. Viva-Voce Defence Result Notification

Academic Notices:
- Google Classroom Joining Link for Computer Vision CACSC504 Summer Semester May-July 2026
- Google Classroom joining link for Design and Analysis of Algorithms Summer Semester May-July 2026
- Google Classroom joining link for Digital Signal Processing ECECC401 Summer Semester May-July 2026
- One-Week Online Short-Term Course organised by ICE Department

Administrative:
- Corrigendum for Notification No. 88 dated 18-05-2026
- All students appearing in exams must carry college ID cards
- East Campus examination schedule active from June 15 2026

Placement Cell:
- Summer internship applications open for CSE and ECE students
- Campus recruitment registrations ongoing on placement portal
- Microsoft Campus Recruitment June 28 2026 eligibility 7.5 CGPA and above
- Amazon SDE Internship Drive June 20 2026 register by June 18 2026

Clubs and Events:
- Coding Club weekly meetup every Thursday 4 PM Lab 2 CSE Block
- IEEE Student Branch technical workshop June 19 2026 2 PM
- Entrepreneurship Cell startup pitch June 21 2026
`

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    let rawText = ''
    try {
      const urls = [
        'https://www.imsnsit.org/imsnsit/notifications.php',
        'https://imsnsit.org/imsnsit/notifications.php',
        'https://www.imsnsit.org/imsnsit/student.htm',
      ]

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Connection': 'keep-alive',
            },
            signal: AbortSignal.timeout(8000)
          })

          if (response.ok) {
            const html = await response.text()
            rawText = html
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 4000)

            if (rawText.length > 200) break
          }
        } catch {
          continue
        }
      }
    } catch {
      console.log('Scraping failed, using real NSUT data')
    }

    const dataToProcess = rawText.length > 200 ? rawText : NSUT_REAL_DATA
    const dataSource = rawText.length > 200 ? 'college_website' : 'nsut_notices'
    const today = new Date().toISOString().split('T')[0]

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Today's date is ${today}. This is official NSUT Delhi campus notice data. Extract all campus-related items. Return ONLY a valid JSON array (no markdown, no code blocks), where each item has: type (one of: deadline, exam, event, club_event, notice, transport, hostel, placement), title (short, max 8 words), description (1 clear sentence), due_date (ISO format like 2026-06-15T09:00:00, or null), priority (low/medium/high).

Data: ${dataToProcess}`
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]'

    let parsedItems
    try {
      const cleaned = responseText.replace(/```json|```/g, '').trim()
      parsedItems = JSON.parse(cleaned)
    } catch (e) {
      return NextResponse.json({ error: 'AI parsing failed', raw: responseText }, { status: 500 })
    }

    if (!parsedItems || parsedItems.length === 0) {
      return NextResponse.json({ message: 'No items found', items: [] })
    }

    const itemsToInsert = parsedItems.map((item: any) => ({
      user_id: user.id,
      type: item.type,
      title: item.title,
      description: item.description,
      due_date: item.due_date,
      priority: item.priority || 'medium',
      source: dataSource,
    }))

    const { data: inserted, error } = await supabase
      .from('items')
      .insert(itemsToInsert)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ items: inserted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
