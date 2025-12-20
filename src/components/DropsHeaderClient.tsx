'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ScannerLine from './ScannerLine';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function DropsHeaderClient() {
  const router = useRouter();
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setMounted(true);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let timer: NodeJS.Timeout = setTimeout(() => {
      router.replace('/');
    }, inactivityTimeout);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.replace('/');
      }, inactivityTimeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [mounted, router, inactivityTimeout]);

  const handleExit = () => {
    router.replace('/');
  };

  if (!mounted) return null;

  const letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  return (
    <div className="relative" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="text-white font-black text-4xl tracking-tighter">
          Keep95.art
        </Link>
        <nav className="hidden lg:flex items-center gap-3">
          {letters.map((letter) => (
            <Link
              key={letter}
              href={`/drops?letter=${letter}`}
              className="text-white/60 hover:text-cyan-400 text-lg font-bold transition"
            >
              {letter}
            </Link>
          ))}
        </nav>
        {user ? (
          <form action="/auth/signout" method="post">
            <button className="bg-white text-black px-10 py-4 rounded-full text-xl font-black hover:scale-105 transition shadow-xl">
              Logout
            </button>
          </form>
        ) : (
          <button onClick={handleExit} className="bg-white text-black px-10 py-4 rounded-full text-xl font-black hover:scale-105 transition shadow-xl">
            Exit
          </button>
        )}
      </div>
      <ScannerLine />
    </div>
  );
}
