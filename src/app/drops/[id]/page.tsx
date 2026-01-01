import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DropViewer } from '@/components/DropViewer';
import Link from 'next/link';

// Force dynamic rendering (dynamic drop pages with DB/auth should be dynamic)
export const dynamic = 'force-dynamic';

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabaseResult = await createClient();

  // Guard: If client is null (build/prerender or env missing), redirect safely
  if (!supabaseResult) {
    console.warn('Supabase client unavailable during build/prerender – redirecting to home');
    redirect('/');
  }

  // TS now knows supabaseResult is NOT null
  const supabase = supabaseResult;

  const { data: drop, error } = await supabase
    .from('drops')
    .select('id, title, price, image_url, return_policy, description, artist:artists (id, name)')
    .eq('id', id)
    .single();

  if (error || !drop) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-8">Drop Not Found</h1>
          <p className="text-xl mb-8">This drop doesn't exist or there was an error loading it.</p>
          <Link href="/drops" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
            Back to Drops
          </Link>
        </div>
      </main>
    );
  }

  return <DropViewer drop={drop} />;
}
