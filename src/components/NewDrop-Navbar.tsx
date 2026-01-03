import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

// Force dynamic rendering (NavBar with auth check should be dynamic)
export const dynamic = 'force-dynamic';

export default async function NewDropNavbar() {
  const supabaseResult = await createClient();

  // Guard: Default to no user if client is null
  let user = null;
  if (supabaseResult) {
    const supabase = supabaseResult;
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-black text-3xl tracking-tighter">
          Keep95.art
        </Link>

        {/* Top-right control for logged-in artists */}
        {user && (
          <div className="flex items-center gap-4">
            <Link
              href={`/artist/${user.id}`}
              className="bg-white text-black px-8 py-3 rounded-full text-lg font-bold hover:scale-105 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
