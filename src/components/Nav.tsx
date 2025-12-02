'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const [currentMode, setCurrentMode] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        supabase.from('profiles')
          .select('current_mode')
          .eq('user_id', sessionUser.id)
          .single()
          .then(({ data }) => {
            setCurrentMode(data?.current_mode || 'artist');
          });
      }
    });
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const switchMode = async (mode: string) => {
    const supabase = createClient();
    await supabase.from('profiles')
      .update({ current_mode: mode })
      .eq('user_id', user?.id);

    setCurrentMode(mode);
    window.location.href = mode === 'artist' ? '/admin/dashboard' : '/drops';
  };

  return (
    <nav className="bg-black text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black hover:text-gray-300 transition cursor-pointer">
          Keep95.art
        </Link>
        <div className="space-x-6">
          {user ? (
            <>
              <Link href="/admin/drops/new" className="hover:text-gray-300 transition cursor-pointer">
                Create Drop
              </Link>
              <Link href="/admin/dashboard" className="hover:text-gray-300 transition cursor-pointer">
                Dashboard
              </Link>
              {currentMode === 'artist' && (
                <button onClick={() => switchMode('consumer')} className="hover:text-gray-300 transition cursor-pointer">
                  Collect Mode
                </button>
              )}
              {currentMode === 'consumer' && (
                <button onClick={() => switchMode('artist')} className="hover:text-gray-300 transition cursor-pointer">
                  Artist Mode
                </button>
              )}
              <button onClick={signOut} className="hover:text-gray-300 transition cursor-pointer">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth" className="hover:text-gray-300 transition cursor-pointer">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
