"use client";

import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 md:p-8 animate-slide-up opacity-0 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};