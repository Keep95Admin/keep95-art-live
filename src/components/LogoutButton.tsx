import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// Force dynamic rendering (component with auth check should be dynamic)
export const dynamic = 'force-dynamic';

// Server action for sign out (fixed null safety)
async function signOut() {
  'use server';

  const supabaseResult = await createClient();

  // Guard: Skip if null (build/prerender/env missing)
  if (!supabaseResult) {
    console.warn('Supabase client unavailable – skipping sign-out');
    redirect('/');
  }

  // TS knows supabaseResult is NOT null → safe
  const supabase = supabaseResult;
  await supabase.auth.signOut();
  redirect('/');
}

export default async function LogoutButton() {  // Or NavBar if you prefer
  const supabaseResult = await createClient();

  // Guard: Skip auth check if null, default to no user
  let user = null;
  if (supabaseResult) {
    const supabase = supabaseResult;
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <nav className
