import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { email, username, password } = await request.json();

  const supabase = await createAdminClient();

  // Guard: If supabase is null (e.g., during build/prerender or env missing), return safe response
  if (!supabase) {
    console.warn('Admin client unavailable – skipping profile upsert during build');
    return NextResponse.json({ success: true, message: 'Skipped during build' }, { status: 200 });
  }

  // Get all users and find if email exists
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const existingUser = usersData.users.find(u => u.email === email);
  let userId;

  if (existingUser) {
    userId = existingUser.id;
    // Optional: If user exists but not artist, proceed to upsert profile
  } else {
    // Create new auth user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // Auto-confirm for simplicity; adjust if you want confirmation emails
      user_metadata: { username },
    });

    if (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    userId = newUser.user.id;
  }

  // Now upsert the profile with the valid user ID
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert([
      {
        id: userId,
        email,
        username,
        role: 'artist',  // Or 'current_mode': 'artist' if that's your column
        wallet_address: ''
      }
    ]);

  if (upsertError) {
    console.error('Profile upsert error:', upsertError);
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user_id: userId }, { status: 200 });
}
