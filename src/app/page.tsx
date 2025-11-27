// src/app/drops/page.tsx — FINAL: LOGOUT OR EXIT BUTTON ALWAYS VISIBLE
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import ScannerLine from '@/components/ScannerLine';

export const revalidate = 60;

export default async function DropsGallery() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  const letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* HEADER — EXACTLY LIKE LANDING PAGE */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          {/* LEFT: LOGO */}
          <Link href="/" className="text-white font-black text-4xl tracking-tighter">
            Keep95.art
          </Link>

          {/* CENTER: A–Z NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-3">
            {letters.map((letter) => (
              <Link
                key={letter}
                href={`/drops?letter=${letter}`}
                className="text-white/60 hover:text-cyan-400 text-lg font-bold transition"
              >
                {letter}
              </Link>
            ))}
          </nav>

          {/* RIGHT: ALWAYS SHOW BUTTON — "Logout" if logged in, "Exit" if guest */}
          {user ? (
            <form action="/auth/signout" method="post">
              <button className="bg-white text-black px-10 py-4 rounded-full text-xl font-black hover:scale-105 transition shadow-xl">
                Logout
              </button>
            </form>
          ) : (
            <Link href="/">
              <button className="bg-white text-black px-10 py-4 rounded-full text-xl font-black hover:scale-105 transition shadow-xl">
                Exit
              </button>
            </Link>
          )}
        </div>

        <ScannerLine />
      </div>

      {/* GALLERY BODY */}
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