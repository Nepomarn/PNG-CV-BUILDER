"use client";

import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* PNG Flag Gradient Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, 
            #D32F2F 0%, 
            #0A0A0A 30%, 
            #0A0A0A 70%, 
            #FF6F00 100%
          )`,
        }}
      />
      
      {/* Bilum Pattern Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
