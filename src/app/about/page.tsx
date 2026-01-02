import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar Header */}
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

      {/* About Content */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-black mb-8">About Keep95: Empowering Artists, One Sale at a Time</h1>
        
        <p className="text-xl mb-6">
          At Keep95, we're all about bridging the gap between talented artists and passionate collectors without the middleman squeeze that plagues the art world. I kicked this off after dipping my toes into art myself—nothing groundbreaking, just mediocre sketches and ideas. But even from that shallow end, I saw how big platforms gouge creators with hefty fees, dragging down prices and stifling the whole market. Artists pour their soul into their work; they shouldn't have to fork over chunks of their earnings just to get seen.
        </p>
        
        <p className="text-xl mb-6">
          That's why we built Keep95: a straightforward platform where artists keep up to 95% of every sale. No hidden cuts, no nonsense—just fair deals that put money back in creators' pockets.
        </p>
        
        <h2 className="text-2xl font-black mb-4">What We Offer:</h2>
        <ul className="list-disc pl-6 space-y-4 text-xl">
          <li><strong>Free Tier</strong>: 5 drops forever, no strings attached. Perfect for testing the waters.</li>
          <li><strong>First Tier Subscription</strong>: Unlock 10 drops, plus access to marketing tutorials to boost your visibility.</li>
          <li><strong>Top Tier Subscription</strong>: Go all-in with 20 drops, advanced analytics to track your growth, and more in-depth marketing resources.</li>
        </ul>
        
        <p className="text-xl mt-6">
          We're here to level the playing field. Join us, keep more of what you earn, and let's make the art world work for the artists.
        </p>
      </div>
    </main>
  );
}
