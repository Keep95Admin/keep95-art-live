import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering (dynamic drop pages with auth/DB queries should be dynamic)
export const dynamic = 'force-dynamic';

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabaseResult = await createClient();

  // Guard: If client is null (e.g., during build/prerender or env missing), redirect safely
  if (!supabaseResult) {
    console.warn('Supabase client unavailable during build/prerender – redirecting to home');
    redirect('/');
  }

  // TS now knows supabaseResult is NOT null → safe to use
  const supabase = supabaseResult;

  const { data: drop, error } = await supabase
    .from('drops')
    .select('id, title, price, image_url, return_policy, description, artist:artists (id, name)')
    .eq('id', id)
    .single();

  if (error || !drop) {
    // Handle not found or error
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-8">Drop Not Found</h1>
          <p className="text-xl mb-8">This drop doesn't exist or there was an error loading it.</p>
          <Link href="/drops" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
            Back to Drops
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8">{drop.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Preview */}
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

          {/* Details & Actions */}
          <div className="space-y-8">
            <div>
              <p className="text-3xl font-bold text-cyan-400">${drop.price}</p>
              <p className="text-xl mt-2">by {drop.artist?.name || 'Unknown Artist'}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-300">{drop.description || 'No description available.'}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
              <p className="text-gray-300">{drop.return_policy || 'Standard policy applies.'}</p>
            </div>

            {/* Buy/Collect Button - Add your actual purchase logic */}
            <button className="bg-cyan-500 text-black px-12 py-6 rounded-full font-bold text-xl hover:bg-cyan-400 transition w-full">
              Collect / Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
