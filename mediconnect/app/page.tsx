import React from "react";
import Link from "next/link";
import GlassPanel from "@/components/widgets/GlassPanel";
import AnimatedButton from "@/components/widgets/AnimatedButton";
import { Video, Bot, FileText, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center text-center overflow-hidden min-h-[90vh] justify-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Over 50,000+ Consultations Completed</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Healthcare That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-cyan">Moves With You</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience the future of medicine. Connect with top specialists, get AI-powered triage, and receive instant digital prescriptions from the comfort of your home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-doctors">
              <AnimatedButton className="w-full sm:w-auto text-lg gap-2 px-8 py-4">
                Find a Doctor <ArrowRight className="w-5 h-5" />
              </AnimatedButton>
            </Link>
            <Link href="/how-it-works">
              <button className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors w-full sm:w-auto text-lg">
                How It Works
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl w-full">
          {[
            { value: "500+", label: "Specialists" },
            { value: "4.9/5", label: "Patient Rating" },
            { value: "<15m", label: "Wait Time" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <GlassPanel key={i} className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-cyan uppercase tracking-wider">{stat.label}</div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-navy-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">State-of-the-art Platform</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need for a seamless healthcare experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassPanel className="group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-electric/20 flex items-center justify-center mb-6 group-hover:bg-electric transition-colors">
                <Video className="w-7 h-7 text-cyan group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">HD Consultations</h3>
              <p className="text-gray-400">Crystal clear peer-to-peer video calls with ultra-low latency, ensuring you don't miss a detail during your session.</p>
            </GlassPanel>
            
            <GlassPanel className="group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-electric/20 flex items-center justify-center mb-6 group-hover:bg-electric transition-colors">
                <Bot className="w-7 h-7 text-cyan group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Triage Chat</h3>
              <p className="text-gray-400">Our advanced AI analyzes your symptoms instantly and recommends the most appropriate specialist for your condition.</p>
            </GlassPanel>
            
            <GlassPanel className="group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-electric/20 flex items-center justify-center mb-6 group-hover:bg-electric transition-colors">
                <FileText className="w-7 h-7 text-cyan group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Digital Prescriptions</h3>
              <p className="text-gray-400">Receive cryptographically signed PDF prescriptions directly to your device immediately after your consultation.</p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan/5 rounded-l-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Patient Stories</h2>
            <p className="text-gray-400">See what our users have to say about MediConnect.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya S.", desc: "The video quality was amazing and the doctor was very professional. Saved me a trip to the hospital!", rating: 5 },
              { name: "Rahul V.", desc: "I used the AI triage which immediately suggested I see a dermatologist. Got my prescription in 15 mins.", rating: 5 },
              { name: "Anitha K.", desc: "Very easy to use interface. The digital prescription was accepted by my local pharmacy without any issues.", rating: 4 }
            ].map((review, i) => (
              <GlassPanel key={i} className="flex flex-col h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-5 h-5 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 flex-grow">"{review.desc}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric to-cyan flex items-center justify-center font-bold text-white">
                    {review.name[0]}
                  </div>
                  <span className="font-medium text-white">{review.name}</span>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-electric/20 to-cyan/20 border border-cyan/30 p-12 text-center relative overflow-hidden glass-morphism">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Health?</h2>
            <p className="text-xl text-cyan-light mb-8 max-w-2xl mx-auto">Join thousands of patients who have already switched to smarter healthcare.</p>
            <Link href="/find-doctors">
              <AnimatedButton className="text-lg px-10 py-4 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                Get Started Today
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
