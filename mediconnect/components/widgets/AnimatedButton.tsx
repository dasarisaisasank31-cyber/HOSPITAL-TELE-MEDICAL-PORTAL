"use client";
import React from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedButton({ children, className = "", ...props }: AnimatedButtonProps) {
  return (
    <button
      className={`relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-electric to-cyan overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}
