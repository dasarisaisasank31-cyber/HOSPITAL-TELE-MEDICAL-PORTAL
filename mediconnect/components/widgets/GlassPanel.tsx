import React from "react";

export default function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
