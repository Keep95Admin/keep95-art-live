// Add to relevant server actions or API routes, e.g., src/app/api/log-event/route.ts
import { createClient } from '@/utils/supabase/server';

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { event_type, metadata } = await req.json();
  await supabase.from('analytics_events').insert({ user_id: user.id, event_type, metadata });
  return new Response('Logged', { status: 200 });
}
