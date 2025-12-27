import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { user_id, email, username } = await request.json();

  const supabase = await createAdminClient();

  // Guard: If supabase is null (e.g., during build/prerender or env missing), return safe response
  if (!supabase) {
    // During build, just return a dummy success (TS needs this for type safety)
    // In production, this shouldn't happen since env is set
    console.warn('Admin client unavailable – skipping profile upsert during build');
    return NextResponse.json({ success: true, message: 'Skipped during build' }, { status: 200 });
  }

  const { error } = await supabase
    .from('profiles')
    .upsert([
      {
        id: user_id,
        email,
        username,
        role: 'collector',
        wallet_address: ''
      }
    ]);

  if (error) {
    console.error('Profile upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
