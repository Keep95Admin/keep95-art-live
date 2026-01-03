import Link from 'next/link';
import ScannerLine from '@/components/ScannerLine';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Force dynamic rendering (NavBar with auth check should be dynamic)
export const dynamic = 'force-dynamic';

// Server Action for sign out (with null safety)
async function signOut() {
  'use server';

  const supabaseResult = await createClient();

  // Guard: Skip if null (build/prerender/env missing)
  if (!supabaseResult) {
    console.warn('Supabase client unavailable – skipping sign-out');
    redirect('/');
  }

  // TS knows supabaseResult is NOT null → safe
  const supabase = supabaseResult;
  await supabase.auth.signOut();
  redirect('/');
}

export default async function ArtistNavBar() {
  const supabaseResult = await createClient();

  // Guard: Default to no user if client is null
  let user = null;
  if (supabaseResult) {
    const supabase = supabaseResult;
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <nav className="relative bg-black"> {/* Explicit bg-black */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link href="/" className="text-white font-black text-4xl tracking-tighter"> {/* Explicit text-white */}
          Keep95.art
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <form action={signOut}>
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-red-700 transition" {/* Explicit text-white */}
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
      <ScannerLine />
    </nav>
  );
}
