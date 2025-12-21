'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CollectorSignup() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);
  const [subscription, setSubscription] = useState('free');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, subscription, enable_2fa: enable2FA, role: 'consumer' } },
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
        <h1 className="text-4xl font-black text-center mb-8">Collector Signup</h1>
        
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
        
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} />
          <span>Enable 2-Factor Auth (TOTP)</span>
        </label>
        
        <div className="space-y-2">
          <p>Subscription Plan:</p>
          <label className="flex items-center space-x-2">
            <input type="radio" name="subscription" value="free" checked={subscription === 'free'} onChange={(e) => setSubscription(e.target.value)} />
            <span>Free</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="subscription" value="basic" checked={subscription === 'basic'} onChange={(e) => setSubscription(e.target.value)} />
            <span>Basic ($9.99/mo)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="subscription" value="premium" checked={subscription === 'premium'} onChange={(e) => setSubscription(e.target.value)} />
            <span>Premium ($19.99/mo)</span>
          </label>
        </div>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
        <p className="text-center text-sm">
          Already have an account? <Link href="/collector-login" className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </form>
    </main>
  );
}
