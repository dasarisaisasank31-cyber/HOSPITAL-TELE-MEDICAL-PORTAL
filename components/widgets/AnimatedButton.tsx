"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  isLoading, 
  variant = "primary", 
  size = "md", 
  children, 
  className = "", 
  ...props 
}) => {
  const baseClasses = "relative overflow-hidden font-semibold inline-flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none rounded-full";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]",
    secondary: "bg-white text-blue-900 border-2 border-blue-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none rounded-full" />
      
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : null}
      
      <span className={isLoading ? "opacity-90" : ""}>
        {children}
      </span>
    </button>
  );
};
