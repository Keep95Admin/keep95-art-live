import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { user_id, email, username } = await request.json();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('artists')
    .insert([{ user_id, email, username, wallet_address: '' }]); // Placeholder for wallet_address

  if (error) {
    console.error('Insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}