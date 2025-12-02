'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistAuth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'artist', username } },
      });
      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }
      setMessage('Magic link sent—check your email to confirm.');
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        setError(loginError.message);
      } else {
        router.push('/artist/' + (await supabase.auth.getUser()).data.user?.id);
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Artist {isSignup ? 'Signup' : 'Login'}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
          />
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
        <p className="text-center text-sm">
          {isSignup ? 'Already have an account?' : 'New here?'} <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-cyan-400 hover:underline">
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </main>
  );
}
