'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex font-inter" style={{ backgroundColor: '#FAF9F6' }}>

      {/* Left panel - teal, NO image */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12" style={{ backgroundColor: '#014D4E' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="font-playfair font-bold text-xl" style={{ color: '#FAF9F6' }}>CampusFlow</span>
        </Link>

        <div>
          <h2 className="font-playfair text-4xl font-bold leading-tight mb-6" style={{ color: '#FAF9F6' }}>
            Hey buddy! 👋
            <br />
            <span style={{ color: 'rgba(250,249,246,0.75)' }}>
              Dive into your campus resources
            </span>
          </h2>
          <p className="font-inter text-lg leading-relaxed mb-10" style={{ color: 'rgba(250,249,246,0.7)' }}>
            Enter your details to access your timetable, notices, attendance, transport and more — all in one place.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📅', text: 'Your personalised timetable' },
              { icon: '📊', text: 'Real-time attendance tracker' },
              { icon: '📢', text: 'NSUT notices and club events' },
              { icon: '🤖', text: 'AcadMate AI assistant' },
              { icon: '🚌', text: 'Transport and metro routes' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-inter text-sm" style={{ color: 'rgba(250,249,246,0.85)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-inter text-xs" style={{ color: 'rgba(250,249,246,0.4)' }}>
          One page to manage your routines, notices, and everything NSUT.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="font-playfair font-bold text-xl" style={{ color: '#014D4E' }}>CampusFlow</span>
          </div>

          <h1 className="font-playfair text-2xl font-bold mb-2" style={{ color: '#0a0a0a' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="font-inter text-sm mb-8" style={{ color: '#666666' }}>
            {isSignUp ? 'Join CampusFlow and organise your NSUT life' : 'Sign in to access your campus dashboard'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="font-inter text-xs mb-1.5 block font-medium" style={{ color: '#444444' }}>Email</label>
              <input
                type="email"
                placeholder="your.email@nsut.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm font-inter outline-none border transition-all"
                style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8', color: '#0a0a0a' }}
                onFocus={e => e.target.style.borderColor = '#014D4E'}
                onBlur={e => e.target.style.borderColor = '#e0ddd8'}
              />
            </div>
            <div>
              <label className="font-inter text-xs mb-1.5 block font-medium" style={{ color: '#444444' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                className="w-full px-4 py-3 rounded-xl text-sm font-inter outline-none border transition-all"
                style={{ backgroundColor: '#ffffff', borderColor: '#e0ddd8', color: '#0a0a0a' }}
                onFocus={e => e.target.style.borderColor = '#014D4E'}
                onBlur={e => e.target.style.borderColor = '#e0ddd8'}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl font-inter text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-inter font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#014D4E', color: '#FAF9F6' }}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <p className="text-center font-inter text-sm" style={{ color: '#666666' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium hover:underline" style={{ color: '#014D4E' }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <p className="text-center font-inter text-xs mt-8" style={{ color: '#aaaaaa' }}>
            Netaji Subhas University of Technology • Dwarka, Delhi
          </p>
        </div>
      </div>
    </div>
  )
}
