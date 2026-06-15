'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: '#FAF9F6' }}>

      {/* HERO SECTION — Full screen with NSUT campus background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        {/* NSUT campus image — ONLY here on hero */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/nsut-campus.jpg')`,
            opacity: 0.12,
          }}
        />
        {/* Overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: '#FAF9F6', opacity: 0.80 }}
        />

        {/* Nav inside hero */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-10">
          <span className="font-playfair text-xl font-bold" style={{ color: '#014D4E' }}>CampusFlow</span>
          <Link href="/login">
            <button className="font-inter text-sm px-5 py-2 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
              Sign In
            </button>
          </Link>
        </div>

        {/* Hero content */}
        <div className={`relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 font-inter font-medium border" style={{ borderColor: '#014D4E', color: '#014D4E', backgroundColor: 'rgba(1,77,78,0.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#014D4E' }} />
            AI-Powered Campus Assistant for NSUT Students
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: '#0a0a0a' }}>
            Your Campus,
            <br />
            <span style={{ color: '#014D4E' }}>Organised.</span>
          </h1>

          <p className="font-inter text-lg md:text-xl max-w-xl mx-auto mb-4 leading-relaxed" style={{ color: '#444444' }}>
            One platform for deadlines, timetables, notices, attendance, and transport.
          </p>
          <p className="font-inter text-base max-w-lg mx-auto mb-10" style={{ color: '#666666' }}>
            Never miss anything at NSUT again.
          </p>

          <Link href="/login">
            <button
              className="px-10 py-4 rounded-xl font-inter font-semibold text-base transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
            >
              Sign In to CampusFlow
            </button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION — Plain off-white, no background image */}
      <section className="py-20 px-4 border-t" style={{ borderColor: '#e0ddd8', backgroundColor: '#FAF9F6' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-center mb-4" style={{ color: '#0a0a0a' }}>
            Everything you need, nothing you don't
          </h2>
          <p className="font-inter text-center mb-12" style={{ color: '#666666' }}>
            All your campus resources in one clean, organised platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '📅', label: 'Timetable', desc: 'View your class schedule by date. Quick access to today and upcoming classes.' },
              { icon: '📢', label: 'Notices', desc: 'Stay updated with NSUT announcements. Never miss a deadline or event.' },
              { icon: '📊', label: 'Attendance', desc: 'Track attendance per subject in real-time. Know exactly where you stand.' },
              { icon: '🚌', label: 'Transport', desc: 'Metro routes, bus timings, and nearby transport options from NSUT Dwarka.' },
              { icon: '🤖', label: 'AcadMate AI', desc: 'Your personal AI assistant. Ask anything about your campus life instantly.' },
              { icon: '📋', label: 'Placement Prep', desc: 'Track placement drives, deadlines, and registration for campus recruitments.' },
            ].map(f => (
              <div key={f.label} className="p-6 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
                <span className="text-3xl block mb-3">{f.icon}</span>
                <p className="font-playfair font-bold text-base mb-1" style={{ color: '#014D4E' }}>{f.label}</p>
                <p className="font-inter text-sm" style={{ color: '#555555' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Teal section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#014D4E' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4" style={{ color: '#FAF9F6' }}>Three simple steps</h2>
          <p className="font-inter mb-12" style={{ color: 'rgba(250,249,246,0.7)' }}>Get started in seconds</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Sign In', desc: 'Use your NSUT email credentials' },
              { num: '02', title: 'Connect', desc: 'Sync your campus data instantly' },
              { num: '03', title: 'Organise', desc: 'Manage your academic life effortlessly' },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="font-playfair text-4xl font-bold mb-2" style={{ color: 'rgba(250,249,246,0.25)' }}>{s.num}</div>
                <p className="font-playfair font-semibold mb-1" style={{ color: '#FAF9F6' }}>{s.title}</p>
                <p className="font-inter text-xs" style={{ color: 'rgba(250,249,246,0.6)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 font-inter text-sm border-t" style={{ borderColor: '#e0ddd8', color: '#888888' }}>
        CampusFlow • Built for NSUT Students • Dwarka, Delhi
      </footer>
    </div>
  )
}
