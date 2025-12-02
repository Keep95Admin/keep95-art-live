import Link from 'next/link';
import ScannerLine from '@/components/ScannerLine';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role === 'artist') {
      redirect(`/artist/${user.id}`);
    } else if (profile?.role === 'consumer') {
      redirect('/drops');
    } else {
      redirect('/setup'); // If no role, to setup
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <Link href="/" className="text-white font-black text-4xl tracking-tighter">
            Keep95.art
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/about" className="text-white/80 hover:text-cyan-400 text-xl font-bold transition">
              About
            </Link>
            <Link href="/faq" className="text-white/80 hover:text-cyan-400 text-xl font-bold transition">
              FAQ
            </Link>
            <Link href="/how-it-works" className="text-white/80 hover:text-cyan-400 text-xl font-bold transition">
              How It Works
            </Link>
          </nav>
        </div>
        <ScannerLine />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        <h1 className="text-8xl font-black tracking-tighter">Keep95.art</h1>
        <p className="text-xl text-center max-w-xl">
          Empowering artists and collectors to connect through digital drops with soul—fair, transparent, and built for the future.
        </p>
        <div className="space-y-12 text-center">
          <Link href="/artist-auth" className="block">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Artist Login / Signup
            </button>
          </Link>
          <Link href="/customer-auth" className="block">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Collector Login / Signup
            </button>
          </Link>
          <Link href="/drops?guest=true" className="block">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Guest Access
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
