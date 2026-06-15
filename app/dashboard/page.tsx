import { createClient } from '@/lib/supabase/server'
import ScrapeButton from '@/components/scrape-button'
import ItemCard from '@/components/item-card'
import ConflictCard from '@/components/conflict-card'
import CampusUpdates from '@/components/campus-updates'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const thisWeekItems = items?.filter(item => {
    if (!item.due_date) return false
    const d = new Date(item.due_date)
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return d >= today && d <= weekFromNow
  }) || []

  const conflicts = items?.filter(item => item.conflict) || []

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold" style={{ color: '#0a0a0a' }}>
            {greeting}, Manya 👋
          </h1>
          <p className="font-inter text-sm mt-1" style={{ color: '#666666' }}>
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <ScrapeButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'This Week', value: thisWeekItems.length },
          { label: 'Conflicts', value: conflicts.length, red: true },
          { label: 'Total Items', value: items?.length || 0 },
          { label: 'Campus Updates', value: items?.filter(i => ['notice','event','club_event'].includes(i.type)).length || 0 },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
            <p className="font-playfair text-3xl font-bold" style={{ color: stat.red ? '#dc2626' : '#014D4E' }}>{stat.value}</p>
            <p className="font-inter text-xs mt-1" style={{ color: '#666666' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conflicts */}
      <ConflictCard conflicts={conflicts} />

      {/* Campus Updates */}
      <CampusUpdates items={items || []} />
    </div>
  )
}
