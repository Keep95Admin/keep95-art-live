'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDrop() {
  const [policy, setPolicy] = useState<'non_refundable' | '7_day_preview' | 'custom'>('non_refundable');
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();  // Create client here
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setArtistId(session.user.id);
      } else {
        router.push('/login');
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) setArtistId(session.user.id);
      else router.push('/login');
    });

    return () => listener?.subscription.unsubscribe();
  }, [router]);  // Removed supabase from deps

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop() || 'file';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const supabase = createClient();
    const { error } = await supabase.storage
      .from('drops-assets')
      .upload(fileName, file);

    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('drops-assets').getPublicUrl(fileName);
      setFileUrl(data.publicUrl);
      alert('File uploaded!');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!fileUrl) return alert('Upload the file first!');
    if (!artistId) return alert('Artist ID missing – refresh the page');

    const supabase = createClient();
    const { error } = await supabase.from('drops').insert({
      title: formData.get('title') as string,
      price: Number(formData.get('price')),
      artist_id: artistId,
      return_policy: policy,
      file_url: fileUrl,
    });

    if (error) alert('Error: ' + error.message);
    else {
      alert('Drop created successfully!');
      e.currentTarget.reset();
      setFileUrl(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-5xl font-black text-center mb-6">Create New Drop</h1>

      <div className="text-center mb-8">
        {artistId ? (
          <p className="text-xl">
            Artist ID:{' '}
            <span className="font-mono bg-green-100 px-4 py-2 rounded-lg text-green-800">
              {artistId}
            </span>
          </p>
        ) : (
          <p className="text-red-600 animate-pulse text-xl">Loading artist…</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input name="title" placeholder="Title" required className="w-full px-6 py-4 border-2 rounded-xl text-lg" />
        <input name="price" type="number" placeholder="Price (USD)" required className="w-full px-6 py-4 border-2 rounded-xl text-lg" />
        <input type="hidden" name="artist_id" value={artistId} />

        <div>
          <label className="block font-bold mb-2">Return Policy</label>
          <select
            value={policy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const value = e.target.value;
              if (value === 'non_refundable' || value === '7_day_preview' || value === 'custom') {
                setPolicy(value);
              }
            }}
            className="w-full px-6 py-4 border-2 rounded-xl"
          >
            <option value="non_refundable">Non-Refundable</option>
            <option value="7_day_preview">7-Day Preview</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block font-bold mb-2">High-Res File (buyer download)</label>
          <label className={`block w-full px-8 py-12 border-4 border-dashed rounded-2xl text-center bg-gray-50 transition ${uploading || !artistId ? 'opacity-50' : 'cursor-pointer hover:bg-gray-100'}`}>
            <input type="file" accept="image/*,.pdf,.zip" onChange={handleFileUpload} disabled={uploading || !artistId} className="hidden" />
            <div className="text-2xl font-bold">
              {uploading ? 'Uploading…' : fileUrl ? 'File Ready' : 'Click to Upload'}
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || !fileUrl || !artistId}
          className="w-full bg-black text-white py-6 rounded-2xl font-black text-2xl disabled:opacity-50 hover:bg-gray-800"
        >
          Create Drop
        </button>
      </form>
    </div>
  );
}
