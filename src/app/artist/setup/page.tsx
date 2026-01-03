'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSetup() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/artist-auth');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('setup_complete, bio, wallet_address').eq('id', user.id).single();
      if (profile) {
        setBio(profile.bio || '');
        setWalletAddress(profile.wallet_address || '');
        setIsInitial(!profile.setup_complete);
      }
    };
    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let profilePicturePath = '';
    if (profilePicture) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`${user.id}/${profilePicture.name}`, profilePicture);
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      profilePicturePath = uploadData.path;
    }

    const updates = {
      bio,
      wallet_address: walletAddress,
      ...(profilePicturePath && { profile_picture_url: profilePicturePath }),  // Store path, not URL
      setup_complete: true
    };

    const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (updateError) {
      setError(updateError.message);
    } else {
      router.push(`/artist/${user.id}`);
    }
    setLoading(false);
  };

  const handleSkip = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({ setup_complete: true }).eq('id', user.id);
    if (!error) {
      router.push(`/artist/${user.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Setup Your Artist Profile</h1>
        {isInitial && (
          <p className="text-center text-gray-400 mb-6">
            You don't have to setup everything right now. You can skip and complete any portion from your dashboard later.
          </p>
        )}
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl text-white"
        />
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
        {isInitial && (
          <button type="button" onClick={handleSkip} className="w-full bg-gray-700 text-white p-4 rounded-full font-bold hover:bg-gray-600">
            Skip for Now
          </button>
        )}
      </form>
    </main>
  );
}
