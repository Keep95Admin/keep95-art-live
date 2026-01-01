import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { email, username, userId } = await request.json();

  const supabase = await createAdminClient();

  if (!supabase) {
    console.warn('Admin client unavailable – skipping profile upsert during build');
    return NextResponse.json({ success: true, message: 'Skipped during build' }, { status: 200 });
  }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert([
      {
        id: userId,
        email,
        username,
        current_mode: 'artist',
        wallet_address: ''
      }
    ]);

  if (upsertError) {
    console.error('Profile upsert error:', upsertError);
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user_id: userId }, { status: 200 });
}
