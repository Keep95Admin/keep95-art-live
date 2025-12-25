'use server';
import { createClient } from '@/utils/supabase/server';

export async function trackDropView(dropId: string) {
  const supabaseResult = await createClient();

  // Guard: Skip tracking if client is null (happens during build/prerender or env missing)
  if (!supabaseResult) {
    console.warn('Supabase client unavailable – skipping view tracking');
    return; // Safe early return during build
  }

  // TS now knows supabaseResult is NOT null → safe to use
  const supabase = supabaseResult;

  const sessionId = crypto.randomUUID();
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('drop_analytics')
    .upsert(
      {
        drop_id: dropId,
        session_id: sessionId,
        viewed_at: new Date().toISOString(),
        viewed_date: today,
      },
      {
        onConflict: 'drop_id,session_id,viewed_date',
        ignoreDuplicates: true,
      }
    );

  if (error && error.code !== '23505') {
    console.error('View tracking error:', error);
  }
}
