'use client';
import React, { useState } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react'; // Or use any icon library

const AnimatedBulkBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // HARDCODED CONTENT (No props passed)
  const content = {
    title: "Power Up Your Team",
    text: "Unlock volume-based pricing on bulk courses for organizations and training programs.",
    cta: "Claim Bulk Discount",
    link: "/online-courses-combo"
  };

  return (
    <>
      {/* 
        INLINE STYLES FOR ANIMATION 
        (Keeps this component self-contained without touching tailwind.config.js)
      */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* BANNER CONTAINER */}
      <div className="relative w-full animate-in slide-in-from-top duration-500">
        <div className="animate-gradient-x bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-y-3 px-4 py-3 text-white sm:px-6 md:flex-row lg:px-8">
            
            {/* LEFT: Icon & Text */}
            <div className="flex flex-1 items-center gap-4 text-center md:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              </span>
              <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                <span className="text-lg font-bold tracking-tight">
                  {content.title}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-white/50 md:block"></span>
                <span className="text-sm font-medium text-indigo-100 md:text-base">
                  {content.text}
                </span>
              </div>
            </div>

            {/* RIGHT: CTA & Close */}
            <div className="flex w-full items-center justify-center gap-4 md:w-auto">
              <a
                href={content.link}
                className="group relative overflow-hidden rounded-full bg-white px-6 py-2 text-sm font-bold text-indigo-700 shadow-sm transition-transform hover:scale-105 hover:bg-indigo-50"
              >
                {/* Shimmer Effect Overlay */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer group-hover:animate-none" />
                
                <span className="relative flex items-center gap-2">
                  {content.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 top-2 rounded-lg p-1 text-indigo-200 hover:bg-white/20 hover:text-white md:static"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedBulkBanner;
