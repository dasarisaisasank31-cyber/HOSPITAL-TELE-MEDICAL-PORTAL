"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [role, setRole] = useState('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await res.json();
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Join MediConnect as a {role.toLowerCase()}</p>
        </div>

        <div className="flex p-1 bg-black/40 border border-white/10 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setRole('PATIENT')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'PATIENT' ? 'bg-white/10 text-white shadow-lg backdrop-blur-md' : 'text-gray-500 hover:text-white'}`}
          >
            Patient
          </button>
          <button 
            type="button"
            onClick={() => setRole('DOCTOR')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'DOCTOR' ? 'bg-white/10 text-white shadow-lg backdrop-blur-md' : 'text-gray-500 hover:text-white'}`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder="John Doe"
              required
            />
          </div>
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
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Sign In</a>
        </div>
      </div>
    </div>
  );
}
