'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AcadMate from '@/components/acadmate'

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/timetable', label: 'Timetable' },
  { href: '/dashboard/attendance', label: 'Attendance' },
  { href: '/dashboard/transport', label: 'Transport' },
  { href: '/dashboard/add', label: 'Add Source' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: '#FAF9F6' }}>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 md:px-6" style={{ backgroundColor: '#014D4E' }}>

        {/* Profile - top left */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-lg" style={{ backgroundColor: '#FAF9F6', color: '#014D4E' }}>
              MJ
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold leading-none" style={{ color: '#FAF9F6' }}>Manya Jain</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(250,249,246,0.65)' }}>2023UIN3365 • IT 6th</p>
            </div>
            <span className="text-xs" style={{ color: 'rgba(250,249,246,0.5)' }}>▾</span>
          </button>

          {showProfile && (
            <div className="absolute top-12 left-0 w-64 rounded-2xl shadow-2xl p-4 z-50 border" style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8' }}>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: '#e0ddd8' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}>
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#0a0a0a' }}>Manya Jain</p>
                  <p className="text-xs" style={{ color: '#666666' }}>2023UIN3365</p>
                  <p className="text-xs" style={{ color: '#666666' }}>IT • 6th Semester</p>
                </div>
              </div>
              <Link href="/dashboard/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full hover:bg-gray-50" style={{ color: '#0a0a0a' }}>
                👤 View Full Profile
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full mt-1 hover:bg-red-50" style={{ color: '#dc2626' }}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Center - two-tone CampusFlow branding */}
        <div className="flex-1 flex justify-center">
          <Link href="/dashboard" className="flex items-center">
            <span className="font-playfair font-bold text-2xl tracking-tight" style={{ color: '#ffffff' }}>Campus</span>
            <span className="font-playfair font-bold text-2xl tracking-tight" style={{ color: '#000000' }}>Flow</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm transition-all font-inter"
              style={{
                backgroundColor: pathname === item.href ? 'rgba(250,249,246,0.15)' : 'transparent',
                color: pathname === item.href ? '#FAF9F6' : 'rgba(250,249,246,0.7)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="pt-16 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t" style={{ backgroundColor: '#014D4E', borderColor: 'rgba(250,249,246,0.1)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 4).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
              style={{ color: pathname === item.href ? '#FAF9F6' : 'rgba(250,249,246,0.45)' }}
            >
              <span className="text-[10px] font-inter">{item.label}</span>
            </Link>
          ))}
          <button className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl" style={{ color: 'rgba(250,249,246,0.7)' }}>
            <span className="text-[10px] font-inter">AcadMate</span>
          </button>
        </div>
      </nav>

      <AcadMate />

      {showProfile && (
        <div className="fixed inset-0 z-30" onClick={() => setShowProfile(false)} />
      )}
    </div>
  )
}
