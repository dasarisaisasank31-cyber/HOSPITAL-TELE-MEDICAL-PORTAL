"use client";
import React from 'react';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-300 tracking-tight">
              MediConnect
            </span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="/#features" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Features</a>
          <a href="/doctors" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Find Doctors</a>
          <a href="/#how-it-works" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">How it Works</a>
          <div className="flex items-center gap-4 ml-4">
            <a href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-semibold">Sign In</a>
            <a href="/register">
              <button className="relative px-6 py-2.5 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
