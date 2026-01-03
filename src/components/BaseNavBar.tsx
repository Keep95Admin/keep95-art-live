import Link from 'next/link';
import ScannerLine from '@/components/ScannerLine';

export default function BaseNavBar() {
  return (
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
  );
}
