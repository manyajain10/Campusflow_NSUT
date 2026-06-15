'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleScrape = async () => {
    setLoading(true)
    toast.info('Fetching latest data from NSUT website...')
    const res = await fetch('/api/scrape', { method: 'POST' })
    const data = await res.json()
    setLoading(false)

    if (data.error) {
      toast.error('Failed: ' + data.error)
    } else if (data.items?.length === 0) {
      toast.info('No new items found')
    } else {
      toast.success(`Added ${data.items.length} item(s) from NSUT!`)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleScrape}
      disabled={loading}
      className="font-inter text-xs px-4 py-2 rounded-xl border transition-all hover:opacity-80 disabled:opacity-50"
      style={{ backgroundColor: '#ffffff', borderColor: '#014D4E', color: '#014D4E' }}
    >
      {loading ? 'Fetching...' : '🔄 Sync NSUT'}
    </button>
  )
}
