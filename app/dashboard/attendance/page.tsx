'use client'

import { useState } from 'react'

const initialAttendance = [
  { subject: 'Compiler', code: 'CSE-601', attended: 35, total: 40, color: '#014D4E', light: '#e8f4f4' },
  { subject: 'Information Security', code: 'IT-603', attended: 38, total: 45, color: '#c2410c', light: '#fff7ed' },
  { subject: 'Digital Forensics', code: 'IT-605', attended: 30, total: 36, color: '#15803d', light: '#f0fdf4' },
  { subject: 'Networking Devices', code: 'IT-607', attended: 28, total: 33, color: '#7c3aed', light: '#f5f3ff' },
  { subject: 'Operating System', code: 'CSE-603', attended: 22, total: 26, color: '#be185d', light: '#fdf4ff' },
]

function getStatus(pct: number) {
  if (pct >= 85) return { label: 'Excellent', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' }
  if (pct >= 75) return { label: 'Safe', bg: '#e8f4f4', border: '#014D4E', text: '#014D4E' }
  if (pct >= 65) return { label: 'Warning', bg: '#fefce8', border: '#fde68a', text: '#a16207' }
  return { label: 'Critical', bg: '#fef2f2', border: '#fecaca', text: '#dc2626' }
}

function canSkip(a: number, t: number) {
  if (a / t < 0.75) return null
  let s = 0
  while (a / (t + s + 1) >= 0.75) s++
  return s
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(initialAttendance)

  const mark = (subject: string, present: boolean) => {
    setAttendance(prev => prev.map(s =>
      s.subject === subject
        ? { ...s, attended: present ? s.attended + 1 : s.attended, total: s.total + 1 }
        : s
    ))
  }

  const overall = attendance.reduce((acc, s) => ({
    attended: acc.attended + s.attended,
    total: acc.total + s.total
  }), { attended: 0, total: 0 })

  const overallPct = Math.round((overall.attended / overall.total) * 100)

  return (
    <div className="space-y-6 font-inter" style={{ color: '#0a0a0a' }}>
      <div>
        <h1 className="font-playfair text-3xl font-bold" style={{ color: '#0a0a0a' }}>Attendance</h1>
        <p className="font-inter text-sm mt-1" style={{ color: '#666666' }}>Manya Jain • 2023UIN3365 • IT 6th Sem</p>
      </div>

      {/* Overall Card */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#014D4E', borderColor: '#014D4E' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-inter text-sm" style={{ color: 'rgba(250,249,246,0.7)' }}>Overall Attendance</p>
            <p className="font-playfair text-5xl font-bold mt-1" style={{ color: '#FAF9F6' }}>{overallPct}%</p>
            <p className="font-inter text-xs mt-1" style={{ color: 'rgba(250,249,246,0.6)' }}>{overall.attended} of {overall.total} classes attended</p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(250,249,246,0.2)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#FAF9F6"
                strokeWidth="2.5"
                strokeDasharray={`${overallPct} ${100 - overallPct}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-playfair text-xs font-bold" style={{ color: '#FAF9F6' }}>{overallPct}%</span>
            </div>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(250,249,246,0.2)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${overallPct}%`, backgroundColor: '#FAF9F6' }} />
        </div>
        <p className="font-inter text-xs mt-2" style={{ color: 'rgba(250,249,246,0.5)' }}>Minimum required: 75%</p>
      </div>

      {/* Subject Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {attendance.map(s => {
          const pct = Math.round((s.attended / s.total) * 100)
          const status = getStatus(pct)
          const skip = canSkip(s.attended, s.total)

          return (
            <div key={s.subject} className="p-5 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <div>
                    <p className="font-inter font-semibold text-sm" style={{ color: '#0a0a0a' }}>{s.subject}</p>
                    <p className="font-inter text-xs" style={{ color: '#888888' }}>{s.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-playfair text-2xl font-bold" style={{ color: s.color }}>{pct}%</p>
                  <span className="font-inter text-xs px-2 py-0.5 rounded-full border" style={{ backgroundColor: status.bg, borderColor: status.border, color: status.text }}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#f0f0ed' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
              </div>

              <div className="flex items-center justify-between">
                <p className="font-inter text-xs" style={{ color: '#666666' }}>
                  {s.attended}/{s.total} •{' '}
                  {skip !== null
                    ? <span style={{ color: '#15803d' }}>Can skip {skip} more</span>
                    : <span style={{ color: '#dc2626' }}>Below 75%</span>
                  }
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => mark(s.subject, true)}
                    className="font-inter text-xs px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80"
                    style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}
                  >
                    + Present
                  </button>
                  <button
                    onClick={() => mark(s.subject, false)}
                    className="font-inter text-xs px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80"
                    style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}
                  >
                    + Absent
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
