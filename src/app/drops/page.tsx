import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import DropsHeaderClient from '@/components/DropsHeaderClient';
import { redirect } from 'next/navigation';

export const revalidate = 60;

export default async function DropsGallery({ searchParams }: { searchParams: Promise<{ guest?: string }> }) {
  const resolvedSearchParams = await searchParams; // Await Promise
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isGuest = resolvedSearchParams.guest === 'true';

  if (!user && !isGuest) {
    redirect('/'); // Kick to home if no auth or guest param
  }

  const { data: drops } = await supabase
    .from('drops')
    .select(`
      id,
      title,
      price,
      image_url,
      return_policy,
      artist:artists (id, name)
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="fixed inset-0 bg-black flex flex-col text-white">
      <DropsHeaderClient />
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-center mb-16">
            Current Drops
          </h1>
          {drops && drops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {drops.map((drop) => (
                <Link key={drop.id} href={`/drops/${drop.id}`} className="group block">
                  <div className="aspect-square bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
                    {drop.image_url ? (
                      <Image
                        src={drop.image_url}
                        alt={drop.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-700 text-6xl font-bold">
                        ART
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold group-hover:text-cyan-400 transition">
                      {drop.title}
                    </h3>
                    <p className="text-3xl font-black text-cyan-400 mt-2">${drop.price}</p>
                    {drop.artist?.[0]?.name && (
                      <p className="text-sm text-gray-500 mt-1">by {drop.artist[0].name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-4xl text-gray-600 py-32">
              No drops live yet — be the first.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}