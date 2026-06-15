'use client'

import { useState } from 'react'

export default function ProfilePhoto() {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className="w-28 h-28 rounded-2xl border-4 flex items-center justify-center font-playfair text-3xl font-bold shrink-0"
        style={{ borderColor: 'rgba(250,249,246,0.3)', backgroundColor: 'rgba(250,249,246,0.15)', color: '#FAF9F6' }}
      >
        MJ
      </div>
    )
  }

  return (
    <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 shadow-xl shrink-0" style={{ borderColor: 'rgba(250,249,246,0.3)' }}>
      <img
        src="/student-photo.jpg"
        alt="Manya Jain"
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
