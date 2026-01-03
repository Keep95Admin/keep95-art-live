'use client';

import { type EmailOtpType } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthConfirm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Confirming your email...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
        if (error) {
          setError(error.message);
          setMessage('');
        } else {
          setMessage('Thank you for confirming your email. You can now close this tab and return to the original tab to complete your setup.');
        }
      });
    } else {
      setError('No verification token found.');
      setMessage('');
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-black mb-8">Email Confirmation</h1>
        <p className="text-xl">{message}</p>
        {error && <p className="text-red-500">{error}</p>}
        <button 
          onClick={() => window.close()}
          className="mt-4 bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400"
        >
          Close This Tab
        </button>
      </div>
    </main>
  );
}
