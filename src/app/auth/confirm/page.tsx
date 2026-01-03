import { type EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AuthConfirm({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const token_hash = resolvedSearchParams.token_hash;
  const type = resolvedSearchParams.type as EmailOtpType | null;

  let message = 'Confirming your email...';
  let errorMsg: string | null = null;

  if (token_hash && type) {
    const supabase = await createClient();

    if (!supabase) {
      errorMsg = 'Supabase client unavailable.';
    } else {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });

      if (error) {
        errorMsg = error.message;
      } else {
        message = 'Thank you for confirming your email. You can now close this tab and return to the original tab to complete your setup.';
        // Optional: Redirect to setup after a delay if needed, but per your request, just show message
      }
    }
  } else {
    errorMsg = 'No verification token found.';
  }

  // If verification failed badly, optional redirect to error page
  if (errorMsg && !message.includes('Thank you')) {
    redirect('/error');  // Or render error inline
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-black mb-8">Email Confirmation</h1>
        <p className="text-xl">{message}</p>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <button 
          onClick={() => window.close()}  // Attempts to close tab, or user can manually switch
          className="mt-4 bg-cyan-500 text-black p-4 rounded-full font-bold hover:bg-cyan-400"
        >
          Close This Tab
        </button>
      </div>
    </main>
  );
}
