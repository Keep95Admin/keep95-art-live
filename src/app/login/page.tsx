// src/app/login/page.tsx — WORKS WITH YOUR CURRENT client.ts
'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArtistLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your email — magic link sent!');
      setTimeout(() => router.push('/drops'), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-900 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight">Artist Portal</h2>
          <p className="mt-3 text-gray-400">No passwords. Just your email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-5 py-4 bg-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-2xl font-black rounded-xl transition shadow-lg"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div className={`p-5 rounded-xl text-center text-lg font-bold ${
            message.includes('Error') 
              ? 'bg-red-900/70 text-red-200' 
              : 'bg-green-900/70 text-green-200'
          }`}>
            {message}
          </div>
        )}

        <p className="text-center text-gray-500 text-sm">
          Works for login <strong>AND</strong> signup — just use your email.
        </p>
      </div>
    </div>
  );
}