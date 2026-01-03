'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ArtistSetup() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_address: walletAddress, role: 'artist' })  // Ensure role set if missing
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
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <h1 className="text-4xl font-black text-center mb-8">Artist Setup</h1>
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-full text-white"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400">
          {loading ? 'Saving...' : 'Complete Setup'}
        </button>
      </form>
    </main>
  );
}
