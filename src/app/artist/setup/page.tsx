'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSetup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/artist-auth');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('current_mode').eq('id', user.id).single();
      if (profile?.current_mode !== 'artist') {
        router.push('/');
        return;
      }

      const { data: artist } = await supabase.from('artists').select('id').eq('id', user.id).single();
      if (artist) {
        router.push(`/artist/${user.id}`);
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let profilePictureUrl = null;
    if (profilePicture) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artist-pictures')  // Create bucket in Supabase if missing
        .upload(`${user.id}/${profilePicture.name}`, profilePicture);

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('artist-pictures')
        .getPublicUrl(uploadData.path);

      profilePictureUrl = publicUrlData.publicUrl;
    }

    const { error: upsertError } = await supabase.from('artists').upsert({
      id: user.id,
      name,
      bio,
      profile_picture_url: profilePictureUrl,
    });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      router.push(`/artist/${user.id}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Artist Setup</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white h-32"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button type="submit" className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          Save Setup
        </button>
      </form>
    </main>
  );
}
