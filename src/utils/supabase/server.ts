import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Guarded regular client (for user auth)
export const createClient = async () => {
  // Skip during static prerender/build (no real cookies/env context)
  if (typeof window !== 'undefined' || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.warn('Supabase client skipped during build/prerender – env or context missing');
    return null; // Return null safely – calling code should handle this
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            // Ignore set errors during static render (common in Server Components)
            console.warn('Cookie set ignored during build:', e);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (e) {
            // Ignore delete errors during static render
            console.warn('Cookie delete ignored during build:', e);
          }
        },
      },
    }
  );
};

// Admin/service-role client (no cookies, no auto-refresh)
export const createAdminClient = async () => {
  // Same guard for build safety
  if (typeof window !== 'undefined' || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Admin client skipped during build/prerender – env or context missing');
    return null;
  }

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
};

// Explicit re-export for TypeScript module resolution safety (helps in some Vercel/TS edge cases)
export { createClient, createAdminClient };
