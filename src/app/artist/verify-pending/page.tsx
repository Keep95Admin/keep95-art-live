'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function VerifyPending() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setError('Email not available for resend.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (resendError) {
      setError(resendError.message);
    } else {
      setMessage('Verification email resent successfully.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-black mb-8">Verify Your Email</h1>
        <p className="text-gray-400 mb-6">We've sent a verification email to your inbox. Please check your email and click the link to confirm your account.</p>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <button 
          type="button" 
          onClick={handleResend} 
          disabled={loading} 
          className="bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400 mb-4"
        >
          {loading ? 'Resending...' : 'Resend Verification Email'}
        </button>
        <p className="text-gray-500 text-sm">Didn't receive it? Check spam or <a href="/artist-auth" className="text-cyan-400 hover:underline">return to login</a>.</p>
      </div>
    </main>
  );
}
