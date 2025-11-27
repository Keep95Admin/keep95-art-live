'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ScannerLine from './ScannerLine';

export default function DropsHeaderClient({ user }: { user: any }) {
  const router = useRouter();
  const inactivityTimeout = 4 * 60 * 1000; // 4 minutes in ms

  useEffect(() => {
    console.log('DropsHeaderClient mounted - client effects active'); // Debug: Confirm hydration

    let timer: NodeJS.Timeout = setTimeout(() => {
      console.log('Inactivity timeout triggered'); // Debug
      router.replace('/login');
    }, inactivityTimeout);

    const resetTimer = () => {
      console.log('Activity detected - resetting timer'); // Debug
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('Inactivity timeout triggered');
        router.replace('/login');
      }, inactivityTimeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer); // Added for scroll activity

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [router]);

  const handleExit = () => {
    console.log('Exit button clicked'); // Debug
    if (window.opener) {
      window.close(); // Works only if window was script-opened
    } else {
      router.replace('/login'); // Safe fallback to login
    }
  };

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link href="/" className="text-white font-black text-4xl">Keep95.art</Link>
        {user ? (
          <form action="/auth/signout" method="post">
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold">Logout</button>
          </form>
        ) : (
          <button onClick={handleExit} className="bg-white text-black px-8 py-3 rounded-full font-bold">Exit</button>
        )}
      </div>
      <ScannerLine />
    </div>
  );
}