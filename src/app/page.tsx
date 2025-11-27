import Link from 'next/link';
import ScannerLine from '@/components/ScannerLine';

export default function Home() {
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
          <Link href="/login" className="block">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Artist Login
            </button>
          </Link>
          <Link href="/customer-login" className="block">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Collector Login
            </button>
          </Link>
          <Link href="/drops?guest=true">
            <button className="bg-black text-white border-4 border-white px-12 py-4 rounded-full text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition w-full max-w-md">
              Guest Access
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
