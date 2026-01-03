export default function VerifyPending() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-black mb-8">Verify Your Email</h1>
        <p className="text-gray-400 mb-6">We've sent a verification email to your inbox. Please check your email and click the link to confirm your account.</p>
        <p className="text-gray-500 text-sm">Didn't receive it? Check spam or <a href="/artist-auth" className="text-cyan-400 hover:underline">try signing up again</a>.</p>
      </div>
    </main>
  );
}
