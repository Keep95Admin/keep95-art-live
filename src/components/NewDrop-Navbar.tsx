'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NewDropNavbar() {
  const params = useParams();
  const id = params.id as string;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-black text-3xl tracking-tighter">
          Keep95.art
        </Link>

        {/* Top-right control */}
        <div className="flex items-center gap-4">
          <Link
            href={`/artist/${id}`}
            className="bg-white text-black px-8 py-3 rounded-full text-lg font-bold hover:scale-105 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
