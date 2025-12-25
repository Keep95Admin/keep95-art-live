// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import InactivityTimer from '@/components/InactivityTimer'; // ← MUST be here

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Keep95.art',
  description: 'Digital art drops with soul.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InactivityTimer />   {/* ← MUST be here */}
        {children}
      </body>
    </html>
  );
}
