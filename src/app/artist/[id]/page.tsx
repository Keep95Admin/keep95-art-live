import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabase = await createClient();
  if (!supabase) {
    return <div>Supabase client unavailable</div>;
  }

  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id, name, profile_picture_url, bio')
    .eq('id', id)
    .single();

  if (artistError || !artist) {
    return <div>Artist not found</div>;
  }

  const { data: drops, error: dropsError } = await supabase
    .from('drops')
    .select('id, title, price, image_url')
    .eq('artist_id', id);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/drops" className="text-cyan-400 hover:underline mb-8 inline-block">
          &larr; Back to Drops
        </Link>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-48 h-48 bg-gray-950 rounded-full overflow-hidden border border-gray-800 relative flex-shrink-0">
            {artist.profile_picture_url ? (
              <Image
                src={artist.profile_picture_url}
                alt={artist.name}
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-700 text-6xl font-bold">
                {artist.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-black mb-4">{artist.name}</h1>
            <p className="text-gray-400 mb-6">{artist.bio || 'No bio available.'}</p>
          </div>
        </div>

        <h2 className="text-2xl font-black mb-6">Drops</h2>

        {drops && drops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drops.map((drop) => (
              <Link 
                key={drop.id} 
                href={`/drops/${drop.id}`}
                className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition-colors"
              >
                <div className="aspect-square relative">
                  {drop.image_url ? (
                    <Image
                      src={drop.image_url}
                      alt={drop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-700 text-6xl font-bold">
                      ART
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{drop.title}</h3>
                  <p className="text-cyan-400">${drop.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No drops available yet.</p>
        )}

        <Link href="/dashboard/analytics" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400 mt-8 inline-block">
          View Analytics
        </Link>
      </div>
    </main>
  );
}
