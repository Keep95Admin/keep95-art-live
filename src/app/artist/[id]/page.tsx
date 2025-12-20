import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function ArtistDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== id) {
    redirect('/'); // Security check
  }

  const { data: drops } = await supabase
    .from('drops')
    .select('*')
    .eq('artist_id', id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8">Your Gallery Dashboard</h1>
        <form action={async () => {
          'use server';
          const supabase = await createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) redirect('/');

          await supabase.from('profiles')
            .update({ current_mode: 'consumer' })
            .eq('user_id', user.id);
          redirect('/drops');
        }}>
          <button className="bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400 mb-8">
            Collect
          </button>
        </form>
        {drops && drops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drops.map((drop) => (
              <Link key={drop.id} href={`/drops/${drop.id}`} className="group block">
                <div className="aspect-square bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
                  {drop.image_url ? (
                    <Image
                      src={drop.image_url}
                      alt={drop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl text-gray-600">No drops in your gallery yet—create one!</p>
        )}
      </div>
    </main>
  );
}