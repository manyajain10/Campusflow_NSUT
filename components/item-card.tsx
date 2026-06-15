'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const typeColors: Record<string, { bg: string, border: string, text: string, dot: string }> = {
  deadline: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', dot: '#ef4444' },
  exam: { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed', dot: '#8b5cf6' },
  event: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', dot: '#3b82f6' },
  club_event: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', dot: '#22c55e' },
  notice: { bg: '#fefce8', border: '#fde68a', text: '#a16207', dot: '#eab308' },
  transport: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', dot: '#f97316' },
  hostel: { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce', dot: '#a855f7' },
  placement: { bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490', dot: '#06b6d4' },
}

export default function ItemCard({ item, showConflict = true }: { item: any, showConflict?: boolean }) {
  const [open, setOpen] = useState(false)
  const colors = typeColors[item.type] || { bg: '#f9f9f9', border: '#e0ddd8', text: '#444444', dot: '#888888' }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md group"
        style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: colors.dot }} />
            <p className="font-inter text-sm font-medium leading-snug line-clamp-2" style={{ color: '#0a0a0a' }}>
              {item.title}
            </p>
          </div>
          <span
            className="font-inter text-xs px-2 py-0.5 rounded-full border shrink-0"
            style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
          >
            {item.type.replace('_', ' ')}
          </span>
        </div>

        {item.description && (
          <p className="font-inter text-xs line-clamp-2 ml-4" style={{ color: '#666666' }}>{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 ml-4">
          {item.due_date ? (
            <p className="font-inter text-xs" style={{ color: '#888888' }}>
              📅 {new Date(item.due_date).toISOString().slice(0, 16).replace('T', ' ')}
            </p>
          ) : <span />}
          {item.source && (
            <span className="font-inter text-xs" style={{ color: '#aaaaaa' }}>{item.source.replace('_', ' ')}</span>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
          <DialogHeader>
            <DialogTitle className="font-playfair text-base leading-snug pr-4" style={{ color: '#0a0a0a' }}>{item.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className="font-inter text-xs px-2.5 py-1 rounded-full border" style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}>
                {item.type.replace('_', ' ')}
              </span>
              <span className="font-inter text-xs px-2.5 py-1 rounded-full border capitalize" style={{ backgroundColor: '#f0f0ed', borderColor: '#e0ddd8', color: '#444444' }}>
                {item.priority} priority
              </span>
            </div>

            {item.description && (
              <div className="p-3 rounded-xl border" style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8' }}>
                <p className="font-inter text-xs mb-1" style={{ color: '#888888' }}>Description</p>
                <p className="font-inter text-sm leading-relaxed" style={{ color: '#0a0a0a' }}>{item.description}</p>
              </div>
            )}

            {item.due_date && (
              <div className="p-3 rounded-xl border" style={{ backgroundColor: '#FAF9F6', borderColor: '#e0ddd8' }}>
                <p className="font-inter text-xs mb-1" style={{ color: '#888888' }}>Date & Time</p>
                <p className="font-inter text-sm" style={{ color: '#0a0a0a' }}>
                  📅 {new Date(item.due_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="font-inter text-xs mt-1" style={{ color: '#666666' }}>
                  🕐 {new Date(item.due_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {item.source && (
              <div className="flex items-center justify-between font-inter text-xs" style={{ color: '#aaaaaa' }}>
                <span>Source: {item.source.replace('_', ' ')}</span>
                <span>Added {new Date(item.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
