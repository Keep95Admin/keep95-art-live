import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { user_id, email, username } = await request.json();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .upsert([
      { id: user_id, email, username, role: 'artist', wallet_address: '' }
    ], { onConflict: 'id' });  // Upsert on id conflict

  if (error) {
    console.error('Insert/Upsert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
