'use client'

import { useState } from 'react'

export default function ConflictCard({ conflicts }: { conflicts: any[] }) {
  const [open, setOpen] = useState(false)
  const hasConflicts = conflicts.length > 0

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between hover:shadow-md"
        style={{
          backgroundColor: hasConflicts ? '#fef2f2' : '#f0fdf4',
          borderColor: hasConflicts ? '#fecaca' : '#bbf7d0',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{hasConflicts ? '⚠️' : '✅'}</span>
          <div>
            <p className="font-playfair font-semibold text-sm" style={{ color: hasConflicts ? '#dc2626' : '#15803d' }}>
              {hasConflicts ? `${conflicts.length} Schedule Conflict${conflicts.length > 1 ? 's' : ''} Detected` : 'No Schedule Conflicts'}
            </p>
            <p className="font-inter text-xs mt-0.5" style={{ color: '#666666' }}>
              {hasConflicts ? 'Click to view affected items' : 'Your schedule looks clear'}
            </p>
          </div>
        </div>
        <span className="text-xs transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none', color: hasConflicts ? '#dc2626' : '#15803d' }}>▼</span>
      </button>

      {open && hasConflicts && (
        <div className="mt-2 p-4 rounded-2xl border space-y-2" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          {conflicts.map(item => (
            <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: '#ffffff', borderColor: '#fecaca' }}>
              <span style={{ color: '#dc2626' }}>•</span>
              <div>
                <p className="font-inter text-sm" style={{ color: '#0a0a0a' }}>{item.title}</p>
                <p className="font-inter text-xs mt-0.5" style={{ color: '#666666' }}>
                  {item.due_date ? new Date(item.due_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) : 'No date'} • {item.type.replace('_', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
