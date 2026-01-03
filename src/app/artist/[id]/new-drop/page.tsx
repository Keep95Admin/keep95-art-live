'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import NewDropNavbar from '@/components/NewDrop-Navbar';

export default function NewDrop() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== id) {
        router.push('/artist-auth');
      }
    };
    checkAuth();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== id) return;

    let imagePath = '';
    if (image) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('drops')
        .upload(`${id}/${image.name}`, image);
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      imagePath = uploadData.path;
    }

    const { error: insertError } = await supabase.from('drops').insert({
      artist_id: id,
      title,
      price: parseFloat(price),
      image_url: imagePath  // Store path
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      router.push(`/artist/${id}`);
    }
    setLoading(false);
  };

  return (
    <>
      <NewDropNavbar />
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8 pt-24">
        <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
          <h1 className="text-4xl font-black text-center mb-8">Create New Drop</h1>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
            {loading ? 'Creating...' : 'Create Drop'}
          </button>
        </form>
      </main>
    </>
  );
}
