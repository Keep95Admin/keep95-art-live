import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Force dynamic rendering (auth/download pages should be dynamic)
export const dynamic = 'force-dynamic';

export default async function DownloadPage({ params }: { params: Promise<{ dropId: string }> }) {
  const resolvedParams = await params;
  const { dropId } = resolvedParams;

  const supabaseResult = await createClient();

  // Guard: If client is null (e.g., during build/prerender or env missing), redirect safely
  if (!supabaseResult) {
    console.warn('Supabase client unavailable during build/prerender – redirecting to login');
    redirect('/login');
  }

  // TS now knows supabaseResult is NOT null → safe to use
  const supabase = supabaseResult;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch the drop (ownership/security check)
  const { data: drop, error } = await supabase
    .from('drops')
    .select('*')
    .eq('id', dropId)
    .eq('artist_id', user.id) // Optional: enforce ownership
    .single();

  if (error || !drop) {
    // Handle not found or access denied
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-8">Access Denied or Drop Not Found</h1>
          <p className="text-xl mb-8">This drop doesn't exist or you don't have permission to download it.</p>
          <a href="/" className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // Main download UI (customize as needed)
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8">Download: {drop.title}</h1>
        <p className="text-xl mb-8">Your high-res file is ready. Price paid: ${drop.price}</p>

        {/* Download button/link - use secure signed URL in production */}
        {drop.high_res_url ? (
          <a
            href={drop.high_res_url}
            download
            className="bg-cyan-500 text-black px-8 py-6 rounded-full font-bold text-xl hover:bg-cyan-400 transition inline-block"
          >
            Download High-Res File Now
          </a>
        ) : (
          <p className="text-red-400 text-xl">No download file available for this drop.</p>
        )}

        {/* Optional preview or details */}
        {drop.image_url && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">Preview</h2>
            <img src={drop.image_url} alt={drop.title} className="max-w-full rounded-2xl border border-gray-800" />
          </div>
        )}
      </div>
    </main>
  );
}
