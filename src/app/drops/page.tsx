import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering (drops listing with auth/DB queries should be dynamic)
export const dynamic = 'force-dynamic';

export default async function DropsPage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string }>;
}) {
  const resolvedSearchParams = await searchParams; // Await Promise
  const supabaseResult = await createClient();

  // Guard: If client is null (e.g., during build/prerender or env missing), redirect safely
  if (!supabaseResult) {
    console.warn('Supabase client unavailable during build/prerender – redirecting to home');
    redirect('/');
  }

  // TS now knows supabaseResult is NOT null → safe to use
  const supabase = supabaseResult;

  const { data: { user } } = await supabase.auth.getUser();

  const isGuest = resolvedSearchParams.guest === 'true';

  if (!user && !isGuest) {
    redirect('/login'); // Or '/auth' depending on your flow
  }

  // Fetch drops (adjust query as needed for your full listing)
  const { data: drops, error } = await supabase
    .from('drops')
    .select('id, title, price, image_url, artist:artists (id, name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Drops fetch error:', error);
    // Fallback UI
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-8">Error Loading Drops</h1>
          <p className="text-xl mb-8">Something went wrong. Try again later.</p>
          <Link href="/" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-12">All Drops</h1>

        {isGuest && (
          <p className="text-center text-xl text-cyan-400 mb-8">
            Viewing as Guest – Sign up for full access!
          </p>
        )}

        {drops && drops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drops.map((drop) => (
              <Link key={drop.id} href={`/drops/${drop.id}`} className="group block">
                <div className="aspect-square bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 relative">
                  {drop.image_url ? (
                    <Image
                      src={drop.image_url}
                      alt={drop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-700 text-6xl font-bold">
                      ART
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">{drop.title}</h3>
                  <p className="text-cyan-400">${drop.price}</p>
                  <p className="text-gray-500 text-sm">by {drop.artist?.[0]?.name || 'Unknown Artist'}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl text-gray-600">No drops available yet—check back soon!</p>
        )}
      </div>
    </main>
  );
}
