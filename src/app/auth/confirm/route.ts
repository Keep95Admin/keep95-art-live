import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Force dynamic rendering (auth/OTP routes should never be static)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = '/';
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabaseResult = await createClient();

    // Guard: If client is null (e.g., during build/prerender or env missing), skip verification and redirect safely
    if (!supabaseResult) {
      console.warn('Supabase client unavailable during build/prerender – skipping OTP verification');
      return NextResponse.redirect(redirectTo);
    }

    // TS now knows supabaseResult is NOT null → safe to use
    const supabase = supabaseResult;

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      redirectTo.searchParams.delete('redirect_to');
      return NextResponse.redirect(redirectTo);
    }
  }

  // Fallback: Redirect to error if verification fails or no valid params
  redirectTo.pathname = '/error';
  return NextResponse.redirect(redirectTo);
}
