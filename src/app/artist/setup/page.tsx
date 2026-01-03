'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSetup() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, skip = false) => {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('No user logged in');
      setLoading(false);
      return;
    }

    const updateData = { role: 'artist' };  // Always ensure role is set
    if (!skip) {
      if (!walletAddress) {
        setError('Wallet address required unless skipping');
        setLoading(false);
        return;
      }
      updateData.wallet_address = walletAddress;
    } else {
      updateData.wallet_address = '';  // Empty for skip
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

    router.push(`/artist/${user.id}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={(e) => handleSubmit(e)} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Artist Setup</h1>
        <input
          type="text"
          placeholder="Wallet Address (optional for non-crypto use)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        <p className="text-sm text-gray-500 text-center">Skip if not using crypto—features disabled until provided. Need a wallet? <a href="https://metamask.io" className="text-cyan-400 hover:underline">Get MetaMask</a>.</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
        <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={loading} className="w-full bg-gray-700 text-white p-4 rounded-full font-bold hover:bg-gray-600">
          {loading ? 'Skipping...' : 'Skip for Now'}
        </button>
      </form>
    </main>
  );
}
