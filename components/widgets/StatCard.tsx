"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: IconComponent, trend, trendDirection = "up", delay = 0 }) => {
  const isPositive = trendDirection === "up";
  const isNegative = trendDirection === "down";

  const renderIcon = () => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    const Component = IconComponent as any;
    return <Component className="w-6 h-6" />;
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col gap-4 animate-slide-up opacity-0 hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] group overflow-hidden relative`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
          {renderIcon()}
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isPositive ? "bg-green-500/20 border border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : 
            isNegative ? "bg-red-500/20 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : 
            "bg-white/10 border border-white/20 text-gray-300"
          }`}>
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-400 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">{value}</p>
      </div>
    </div>
  );
};
