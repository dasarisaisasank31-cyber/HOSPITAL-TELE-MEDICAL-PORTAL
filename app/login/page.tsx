"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl text-white text-3xl font-bold mb-4 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            +
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Login to your MediConnect account</p>
        </div>

        {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-medium backdrop-blur-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account? <a href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Register now</a>
        </div>
      </div>
    </div>
  );
}
