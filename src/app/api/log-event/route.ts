import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return new NextResponse('Supabase client not initialized', { status: 500 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { event_type, metadata } = await req.json();
  await supabase.from('analytics_events').insert({ user_id: user.id, event_type, metadata });
  return new NextResponse('Logged', { status: 200 });
}
