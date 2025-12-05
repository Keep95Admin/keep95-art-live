'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function CustomerLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient();  // Create client here
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This goes through our callback → auto-creates consumer row
        emailRedirectTo: `${window.location.origin}/auth/complete-signup`,
      },
    })
    if (error) {
      setMessage('Error: ' + error.message)
      setLoading(false)
    } else {
      setMessage('Check your email! Magic link sent.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-12">
        {/* Back link */}
        <Link href="/" className="text-white/70 hover:text-white text-lg underline">
          ← Back to Keep95.art
        </Link>
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Collector Sign In
          </h1>
          <p className="text-xl text-white/80">
            No password needed.<br />
            We’ll email you a magic link.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-8 py-6 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-xl focus:outline-none focus:border-white transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-full text-2xl font-black hover:scale-105 transition shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {/* Success / error message */}
        {message && (
          <p className={`text-lg font-medium ${message.includes('Check') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        {/* Terms */}
        <p className="text-white/50 text-sm">
          By signing in you agree to our{' '}
          <Link href="/terms" className="underline hover:text-white">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
