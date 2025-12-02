'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function Nav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
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
