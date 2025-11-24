// src/components/InactivityTimer.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InactivityTimer() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        router.push('/'); // Send back to landing page
      }, 4 * 60 * 1000); // 4 minutes
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Start the timer on first load
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  // This component renders nothing — it's invisible
  return null;
}
