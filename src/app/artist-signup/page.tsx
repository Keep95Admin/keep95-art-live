'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();  // Create client here
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'artist' } },
    });
    if (signupError) {
      setError(signupError.message);
    } else {
      router.push('/?message=Check your email to confirm signup');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSignup} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Artist Signup</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
