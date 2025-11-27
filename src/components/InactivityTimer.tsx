// src/components/InactivityTimer.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InactivityTimer() {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.replace('/'); // replace = no back-button loop
      }, 4 * 60 * 1000); // 4 minutes in prod
      // ↓↓↓ FOR TESTING: change to 10 seconds ↓↓↓
      // }, 10 * 1000);
    };

    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'touchmove'];

    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));

    resetTimer(); // start immediately

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  return null;
}