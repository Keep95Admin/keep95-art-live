import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Force dynamic (auth/signout should always be dynamic)
export const dynamic = 'force-dynamic';

export async function POST() {
  const supabaseResult = await createClient();

  // Guard: If client is null (e.g., during build/prerender or env missing), skip sign-out and redirect safely
  if (!supabaseResult) {
    console.warn('Supabase client unavailable during build/prerender – skipping sign-out');
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
  }

  // TS now knows supabaseResult is NOT null → safe to use
  const supabase = supabaseResult;

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  );
}
