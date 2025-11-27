'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function ArtistSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);
  const [artType, setArtType] = useState('');
  const [genre, setGenre] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, art_type: artType, genre, bio, enable_2fa: enable2FA, role: 'artist' }, // Add role for redirect
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // MFA setup if enabled
    if (enable2FA && data.user) {
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (mfaError) {
        setError('2FA setup failed: ' + mfaError.message);
      } else {
        console.log('MFA enrolled:', mfaData); // Handle QR in prod
      }
    }

    router.push('/?message=Check your email to confirm signup');
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
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        
        <select
          value={artType}
          onChange={(e) => setArtType(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        >
          <option value="" disabled>Type of Art</option>
          <option value="digital">Digital</option>
          <option value="painting">Painting</option>
          <option value="sculpture">Sculpture</option>
          <option value="photography">Photography</option>
          <option value="other">Other</option>
        </select>
        
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        >
          <option value="" disabled>Genre</option>
          <option value="abstract">Abstract</option>
          <option value="realism">Realism</option>
          <option value="street art">Street Art</option>
          <option value="surrealism">Surrealism</option>
          <option value="other">Other</option>
        </select>
        
        <textarea
          placeholder="Profile Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white h-32"
        />
        
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} />
          <span>Enable 2-Factor Auth (TOTP)</span>
        </label>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </form>
    </main>
  );
}
