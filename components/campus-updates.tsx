'use client'

import { useState } from 'react'
import ItemCard from './item-card'

const categories = [
  { key: 'all', label: 'All' },
  { key: 'deadline', label: 'Deadlines' },
  { key: 'exam', label: 'Exams' },
  { key: 'event', label: 'Events' },
  { key: 'club_event', label: 'Club Events' },
  { key: 'notice', label: 'Notices' },
  { key: 'transport', label: 'Transport' },
  { key: 'hostel', label: 'Hostel' },
  { key: 'placement', label: 'Placements' },
]

export default function CampusUpdates({ items }: { items: any[] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = activeTab === 'all'
    ? items
    : items.filter(i => i.type === activeTab)

  const displayed = showAll ? filtered : filtered.slice(0, 3)
  const hasMore = filtered.length > 3

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-xl font-bold" style={{ color: '#0a0a0a' }}>Campus Updates</h2>
        <span className="font-inter text-xs" style={{ color: '#888888' }}>{filtered.length} items</span>
      </div>

      {/* Category tabs - no emojis, plain text only */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setActiveTab(cat.key); setShowAll(false) }}
            className="font-inter text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              backgroundColor: activeTab === cat.key ? '#014D4E' : '#ffffff',
              borderColor: activeTab === cat.key ? '#014D4E' : '#e0ddd8',
              color: activeTab === cat.key ? '#FAF9F6' : '#444444',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">📭</p>
          <p className="font-inter text-sm" style={{ color: '#888888' }}>No {activeTab.replace('_', ' ')} items yet</p>
          <p className="font-inter text-xs mt-1" style={{ color: '#aaaaaa' }}>Sync college website or add a source</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {displayed.map((item) => (
              <ItemCard key={item.id} item={item} showConflict={false} />
            ))}
          </div>

          {/* View More / Show Less */}
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="font-inter text-sm px-6 py-2.5 rounded-xl border transition-all hover:shadow-md"
                style={{
                  backgroundColor: showAll ? '#ffffff' : '#014D4E',
                  borderColor: '#014D4E',
                  color: showAll ? '#014D4E' : '#FAF9F6',
                }}
              >
                {showAll ? 'Show Less' : `View More Notices (${filtered.length - 3} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
