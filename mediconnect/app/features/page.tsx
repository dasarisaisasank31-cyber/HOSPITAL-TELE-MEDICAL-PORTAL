import React from "react";
import GlassPanel from "@/components/widgets/GlassPanel";
import { Shield, Activity, FileText, Video, Bot, Lock } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Consultations",
    desc: "Experience zero-lag, crystal clear peer-to-peer video calls with your specialists. Includes secure screen sharing for medical reports.",
    color: "text-blue-400"
  },
  {
    icon: Bot,
    title: "AI Triage Assistant",
    desc: "Our GPT-4 powered symptom checker analyzes your health issues and recommends the perfect specialist in under 30 seconds.",
    color: "text-cyan-400"
  },
  {
    icon: FileText,
    title: "Instant E-Prescriptions",
    desc: "Receive cryptographically signed PDF prescriptions immediately after your consultation, accepted at all major pharmacies.",
    color: "text-green-400"
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Dedicated secure portals for Patients, Doctors, Pharmacists, and Admins, ensuring streamlined workflows for everyone.",
    color: "text-purple-400"
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    desc: "End-to-end encryption for all medical records and payment transactions ensuring 100% HIPAA and local compliance.",
    color: "text-red-400"
  },
  {
    icon: Activity,
    title: "Live Vitals Tracking",
    desc: "Sync your wearables or manually input vitals for your doctor to monitor your health trends in real-time.",
    color: "text-yellow-400"
  }
];

export default function Features() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-electric/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Advanced Features for Modern Healthcare</h1>
          <p className="text-xl text-gray-400">Discover the tools that make MediConnect the most powerful telemedicine platform.</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <GlassPanel key={idx} className="group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5">
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
            </GlassPanel>
          ))}
        </div>
      </section>
    </div>
  );
}
