'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSetup() {
  const router = useRouter();
  const [step, setStep] = useState(0);  // 0: Welcome, 1: Wallet, 2: Picture, 3: Bio
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUsername(profile.username);
          setStep(0);  // Start at welcome
        }
      }
    };
    fetchUsername();
  }, []);

  const handleNext = async (skip = false, final = false) => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('No user logged in');
      setLoading(false);
      return;
    }

    let updateData: any = { role: 'artist' };

    if (step === 1 && !skip) {
      if (!walletAddress) {
        setError('Wallet address required unless skipping');
        setLoading(false);
        return;
      }
      updateData.wallet_address = walletAddress;
    } else if (step === 1 && skip) {
      updateData.wallet_address = '';
    }

    if (step === 2 && !skip && profilePicture) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`profile-${user.id}.${profilePicture.name.split('.').pop()}`, profilePicture, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(uploadData.path);

      updateData.profile_picture_url = publicUrlData.publicUrl;
    }

    if (step === 3 && !skip) {
      updateData.bio = bio;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    if (final || step === 3) {
      router.push(`/artist/${user.id}`);
    } else {
      setStep(step + 1);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        {step === 0 && (
          <>
            <h1 className="text-4xl font-black text-center mb-8">Welcome, {username}!</h1>
            <button onClick={() => setStep(1)} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
              Start Setup
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="text-4xl font-black text-center mb-8">Artist Setup: Wallet</h1>
            <input
              type="text"
              placeholder="Wallet Address (optional for non-crypto use)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
            />
            <p className="text-sm text-gray-500 text-center">Skip if not using crypto—features disabled until provided. Need a wallet? <a href="https://metamask.io" className="text-cyan-400 hover:underline">Get MetaMask</a>.</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button onClick={() => handleNext(false)} disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
              {loading ? 'Saving...' : 'Save and Continue'}
            </button>
            <button onClick={() => handleNext(true)} disabled={loading} className="w-full bg-gray-700 text-white p-4 rounded-full font-bold hover:bg-gray-600">
              {loading ? 'Skipping...' : 'Skip for Now'}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-4xl font-black text-center mb-8">Artist Setup: Profile Picture</h1>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button onClick={() => handleNext(false)} disabled={loading || !profilePicture} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
              {loading ? 'Uploading...' : 'Upload and Continue'}
            </button>
            <button onClick={() => handleNext(true)} disabled={loading} className="w-full bg-gray-700 text-white p-4 rounded-full font-bold hover:bg-gray-600">
              {loading ? 'Skipping...' : 'Skip for Now'}
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-4xl font-black text-center mb-8">Artist Setup: Bio</h1>
            <textarea
              placeholder="Tell us about yourself (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white h-32"
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button onClick={() => handleNext(false, true)} disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
              {loading ? 'Saving...' : 'Save and Finish'}
            </button>
            <button onClick={() => handleNext(true, true)} disabled={loading} className="w-full bg-gray-700 text-white p-4 rounded-full font-bold hover:bg-gray-600">
              {loading ? 'Skipping...' : 'Skip and Finish'}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
