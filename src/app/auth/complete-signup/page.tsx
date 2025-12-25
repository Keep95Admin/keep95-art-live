'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

function CompleteSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient(); // Create here
    const confirmUser = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (token && email) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        });

        if (error) {
          router.replace('/?error=verification_failed');
        } else {
          // Get user ID and role
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles') 
              .select('role, current_mode')
              .eq('user_id', user.id)
              .single();

            if (profile?.role === 'artist') {
              if (profile.current_mode === 'consumer') {
                router.replace('/drops');
              } else {
                router.replace(`/artist/${user.id}`);
              }
            } else {
              router.replace('/drops');
            }
          } else {
            router.replace('/?error=auth_failed');
          }
        }
      } else {
        router.replace('/?error=invalid_link');
      }
    };

    confirmUser();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-xl">Completing signup...</p>
    </div>
  );
}

export default function CompleteSignup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-xl">Loading...</p></div>}>
      <CompleteSignupContent />
    </Suspense>
  );
}
