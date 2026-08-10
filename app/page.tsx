import React from 'react';
import { AnimatedButton } from '@/components/widgets/AnimatedButton';
import { GlassPanel } from '@/components/widgets/GlassPanel';
import { ThreeDCard } from '@/components/widgets/ThreeDCard';
import Navbar from '@/components/layout/Navbar';
import { Video, Bot, FileText, ArrowRight, Activity, Shield, Clock, HeartPulse, Sparkles } from 'lucide-react';

const Hero = () => (
  <section className="relative pt-40 pb-32 px-4 overflow-hidden bg-[#030712] min-h-screen flex items-center">
    {/* Animated Gradient Background */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[150px] rounded-full animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse-soft"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
    </div>

    <div className="relative max-w-7xl mx-auto text-center z-10 w-full">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-8 uppercase tracking-widest backdrop-blur-md animate-slide-up shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        The Future of Healthcare is Here
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter animate-slide-up stagger-1">
        Next-Gen Care, <br /> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          Anywhere You Go
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-slide-up stagger-2">
        Experience seamless telemedicine with top specialists. AI-powered triage, crystal-clear video calls, and instant digital prescriptions.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 animate-slide-up stagger-3">
        <a href="/doctors" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105">
          <span className="relative z-10 flex items-center gap-2">Book a Specialist <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
        <a href="/register?role=DOCTOR" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-xl">
          Join as a Doctor
        </a>
      </div>
      
      {/* Stats Glass Panel */}
      <ThreeDCard className="max-w-5xl mx-auto rounded-3xl animate-slide-up stagger-4" maxRotation={5} scale={1.01}>
        <div className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden divide-x divide-y md:divide-y-0 divide-white/10 grid grid-cols-2 md:grid-cols-4 preserve-3d">
          {[
            { value: "500+", label: "Verified Experts" },
            { value: "50k+", label: "Happy Patients" },
            { value: "4.9★", label: "Average Rating" },
            { value: "24/7", label: "Instant Access" }
          ].map((stat, i) => (
            <div key={i} className="p-8 group hover:bg-white/5 transition-colors duration-500 cursor-default preserve-3d">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500 translate-z-20">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors duration-500 translate-z-10">{stat.label}</div>
            </div>
          ))}
        </div>
      </ThreeDCard>
    </div>
  </section>
);

const Feature = ({ icon: Icon, title, desc, delay, color }: any) => (
  <ThreeDCard className="rounded-3xl" maxRotation={12}>
    <div className={`p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 backdrop-blur-xl transition-all duration-500 group relative overflow-hidden preserve-3d h-full`} style={{ animationDelay: `${delay}ms` }}>
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] translate-z-30">
        <Icon className="w-7 h-7 drop-shadow-[0_0_10px_currentColor]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight relative z-10 translate-z-20">{title}</h3>
      <p className="text-gray-400 leading-relaxed relative z-10 translate-z-10">{desc}</p>
    </div>
  </ThreeDCard>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      
      <section id="features" className="py-32 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              A Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Care Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Experience healthcare without boundaries, powered by state-of-the-art infrastructure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature 
              icon={Video} 
              title="Crystal Clear WebRTC" 
              desc="Bank-grade encrypted peer-to-peer video calls with ultra-low latency. It feels like being in the same room."
              delay={100}
              color="blue"
            />
            <Feature 
              icon={Bot} 
              title="AI Triage Companion" 
              desc="Our GPT-4 powered medical assistant analyzes your symptoms instantly and guides you to the right specialist."
              delay={200}
              color="purple"
            />
            <Feature 
              icon={FileText} 
              title="Digital Prescriptions" 
              desc="Receive cryptographically signed PDF prescriptions valid at any pharmacy immediately after your call."
              delay={300}
              color="cyan"
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
              Ready to transcend <br /> <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">traditional care?</span>
            </h2>
            <p className="text-gray-400 text-xl mb-12 leading-relaxed font-light">Join thousands of patients and top-tier doctors on the most advanced telemedicine platform built for the future.</p>
            <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Create Your Free Account
            </a>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4 w-full">
            <ThreeDCard className="rounded-2xl" maxRotation={15}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 h-full preserve-3d">
                <Shield className="w-10 h-10 text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] translate-z-30" />
                <h4 className="font-bold text-lg text-white mb-2 translate-z-20">End-to-End Encrypted</h4>
                <p className="text-sm text-gray-400 translate-z-10">Your health data is locked securely.</p>
              </div>
            </ThreeDCard>
            <ThreeDCard className="rounded-2xl mt-8" maxRotation={15}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20 h-full preserve-3d">
                <Clock className="w-10 h-10 text-purple-400 mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] translate-z-30" />
                <h4 className="font-bold text-lg text-white mb-2 translate-z-20">Zero Wait Times</h4>
                <p className="text-sm text-gray-400 translate-z-10">Connect instantly, whenever needed.</p>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
