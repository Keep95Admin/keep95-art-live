import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DownloadPage({ params }: { params: Promise<{ dropId: string }> }) {
  const resolvedParams = await params; // Await Promise
  const { dropId } = resolvedParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: drop, error } = await supabase
    .from('drops')
    .select('title, file_url, buyer_id')
    .eq('id', dropId)
    .single();

  if (error || !drop || drop.buyer_id !== user.id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-5xl font-black">
        Access Denied
      </div>
    );
  }

  // Extract the path inside the bucket
  const path = drop.file_url.split('/').pop()!;

  const { data: signed, error: signedError } = await supabase.storage
    .from('drops-assets')
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (signedError || !signed?.signedUrl) {
    return <div className="text-center mt-40 text-3xl text-red-500">Failed to generate secure link</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-12">
      <h1 className="text-7xl font-black">Download Ready</h1>
      <p className="text-3xl">"{drop.title}"</p>
      <a
        href={signed.signedUrl}
        download
        className="bg-white text-black px-20 py-10 rounded-full text-5xl font-black hover:scale-110 transition"
      >
        Download Now (expires in 1 hour)
      </a>
    </div>
  );
}
