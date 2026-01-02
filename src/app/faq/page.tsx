import Link from 'next/link';

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="relative bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-black text-3xl tracking-tighter flex items-center">
            Keep95.art
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white/80 hover:text-cyan-400 text-lg font-bold transition">
              Home
            </Link>
            <Link href="/drops" className="text-white/80 hover:text-cyan-400 text-lg font-bold transition">
              Drops
            </Link>
            <Link href="/faq" className="text-white/80 hover:text-cyan-400 text-lg font-bold transition">
              FAQ
            </Link>
            <Link href="/how-it-works" className="text-white/80 hover:text-cyan-400 text-lg font-bold transition">
              How it Works
            </Link>
            <Link href="/about" className="text-white/80 hover:text-cyan-400 text-lg font-bold transition">
              About
            </Link>
            <Link href="/artist-auth" className="bg-cyan-500 text-black px-4 py-2 rounded-full font-bold hover:bg-cyan-400 transition">
              Artist Login
            </Link>
            <Link href="/collector-auth" className="bg-cyan-500 text-black px-4 py-2 rounded-full font-bold hover:bg-cyan-400 transition">
              Collector Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-black mb-8">FAQ</h1>
        <p className="text-xl mb-6">Placeholder content for FAQ. Add questions and answers here.</p>
      </div>
    </main>
  );
}
