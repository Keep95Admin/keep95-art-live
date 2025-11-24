// src/app/layout.tsx — ADD THE TIMER HERE
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import InactivityTimer from '@/components/InactivityTimer';

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
        {/* 4-MINUTE INACTIVITY TIMER — WORKS ON EVERY PAGE */}
        <InactivityTimer />
        <main className="min-h-screen bg-black">{children}</main>
      </body>
    </html>
  );
}