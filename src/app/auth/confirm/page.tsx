'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    const handleConfirm = async () => {
      if (tokenHash && type === 'signup') {
        const { error } = await supabase.auth.verifyOtp({ tokenHash, type: 'signup' });
        if (error) {
          console.error('Verification error:', error);
          router.push('/artist-auth?error=verification_failed');
          return;
        }
      }

      // Refresh session and redirect
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/artist/setup');
      } else {
        router.push('/artist-auth?verified=true');
      }
    };

    handleConfirm();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Verifying...
    </div>
  );
}
