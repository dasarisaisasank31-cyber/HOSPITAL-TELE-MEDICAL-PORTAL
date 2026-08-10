"use client";
import React, { useRef, useState } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // max tilt angle in degrees
  scale?: number; // scale on hover
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = "",
  maxRotation = 12,
  scale = 1.03,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Position of cursor relative to element center
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Normalised position (-0.5 to 0.5)
    const normX = x / width;
    const normY = y / height;

    // Target rotations
    setRotateX(-normY * maxRotation);
    setRotateY(normX * maxRotation);

    // Glow position (0% to 100%)
    const pctX = ((e.clientX - rect.left) / width) * 100;
    const pctY = ((e.clientY - rect.top) / height) * 100;
    setGlowX(pctX);
    setGlowY(pctY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out preserve-3d overflow-hidden ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Lighting Glare / Glow Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.45), transparent 85%)`,
        }}
      />
      {children}
    </div>
  );
};
