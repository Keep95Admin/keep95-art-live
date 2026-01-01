'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DropViewerProps {
  drop: {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
    return_policy: string | null;
    description: string | null;
    artist: Array<{ id: string; name: string }> | null;
  };
}

export function DropViewer({ drop }: DropViewerProps) {
  useEffect(() => {
    // Log the view event
    fetch('/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'drop_view',
        metadata: { drop_id: drop.id },
      }),
    }).catch(console.error);  // Silent fail to not break UI
  }, [drop.id]);  // Run once per drop

  const artistName = drop.artist?.[0]?.name || 'Unknown Artist';
  const artistId = drop.artist?.[0]?.id || '';

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/drops" className="text-cyan-400 hover:underline mb-8 inline-block">
          &larr; Back to Drops
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 relative">
            {drop.image_url ? (
              <Image
                src={drop.image_url}
                alt={drop.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-700 text-6xl font-bold">
                ART
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-black mb-4">{drop.title}</h1>
            <p className="text-cyan-400 text-2xl mb-6">${drop.price}</p>
            <p className="text-gray-400 mb-4">by <Link href={`/artist/${artistId}`} className="text-cyan-400 hover:underline">{artistName}</Link></p>
            <p className="mb-6">{drop.description || 'No description available.'}</p>
            <p className="text-sm text-gray-500 mb-8">Return Policy: {drop.return_policy || 'None specified.'}</p>
            
            {/* Placeholder for buy button – add sales logging here later */}
            <button className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
