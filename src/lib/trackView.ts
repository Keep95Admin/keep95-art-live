// src/lib/trackView.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function trackDropView(dropId: string) {
  const supabase = await createClient();

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