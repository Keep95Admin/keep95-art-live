'use client';

import Image from 'next/image';

export default function VerifyPending() {
  const handleClose = () => {
    window.close();
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="mb-8">
        <Image src="/logo.svg" alt="Keep95 Logo" width={200} height={100} />  {/* Adjust path/size if logo differs */}
      </div>
      <h1 className="text-4xl font-black text-center mb-8">Thanks for joining Keep95!</h1>
      <p className="text-xl text-center mb-8">Check your email for a verification link. Close this page—the email verification will take you to your login.</p>
      <button onClick={handleClose} className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-400">
        Close
      </button>
    </main>
  );
}
