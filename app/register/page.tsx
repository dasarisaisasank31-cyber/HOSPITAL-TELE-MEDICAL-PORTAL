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

  const [specialization, setSpecialization] = useState('General Physician');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [qualifications, setQualifications] = useState('MBBS');
  const [experience, setExperience] = useState('5');
  const [consultationFee, setConsultationFee] = useState('500');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { email, password, name, role };
      if (role === 'DOCTOR') {
        payload.specialization = specialization;
        payload.licenseNumber = licenseNumber;
        payload.qualifications = qualifications;
        payload.experience = Number(experience) || 1;
        payload.consultationFee = Number(consultationFee) || 500;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push(role === 'DOCTOR' ? '/login?registered=true&pending=true' : '/login?registered=true');
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
      
      <div className="relative max-w-lg w-full bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-slide-up my-8">
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
              className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder={role === 'DOCTOR' ? "Dr. John Doe" : "John Doe"}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
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
              className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
              placeholder="••••••••"
              required
            />
          </div>

          {role === 'DOCTOR' && (
            <>
              <div className="pt-2 border-t border-white/10 text-xs font-bold uppercase tracking-wider text-cyan-400">
                Doctor Professional Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="ENT Specialist">ENT Specialist</option>
                    <option value="Dentist">Dentist</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Pediatrician">Pediatrician</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
                    placeholder="MCI-123456"
                    required={role === 'DOCTOR'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Qualifications</label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
                    placeholder="MBBS, MD"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Experience (Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
                    placeholder="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-gray-600"
                    placeholder="500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing...' : role === 'DOCTOR' ? 'Submit Application for Approval' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Sign In</a>
        </div>
      </div>
    </div>
  );
}
