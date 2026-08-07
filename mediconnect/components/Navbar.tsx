"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";
import AnimatedButton from "./widgets/AnimatedButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass-morphism py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-cyan flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">MediConnect</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/features" className="hover:text-cyan transition-colors">Features</Link>
          <Link href="/how-it-works" className="hover:text-cyan transition-colors">How it Works</Link>
          <Link href="/find-doctors" className="hover:text-cyan transition-colors">Find Doctors</Link>
          <Link href="/find-doctors">
            <AnimatedButton>Book Consultation</AnimatedButton>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-morphism border-t border-white/10 p-4 flex flex-col gap-4">
          <Link href="/features" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>Features</Link>
          <Link href="/how-it-works" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>How it Works</Link>
          <Link href="/find-doctors" className="p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>Find Doctors</Link>
          <Link href="/find-doctors" onClick={() => setIsOpen(false)}>
            <AnimatedButton className="w-full">Book Consultation</AnimatedButton>
          </Link>
        </div>
      )}
    </nav>
  );
}
