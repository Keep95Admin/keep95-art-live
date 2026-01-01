import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/');  // Fallback

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('tier, current_mode')  // Use current_mode for artist check
    .eq('user_id', user.id)
    .single();

  if (error || !profile || profile.current_mode !== 'artist' || profile.tier === 'free') {
    return (
      <div className="min-h-screen bg-black text-white p-8 text-center">
        <h1 className="text-4xl font-black mb-4">Access Denied</h1>
        <p>Subscribe as an artist to view analytics.</p>
      </div>
    );
  }

  // Fetch events for this user
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(1000);  // Cap for perf; paginate later

  return <AnalyticsDashboard tier={profile.tier} events={events || []} />;
}
