'use client';
import React, { useState, useEffect } from 'react';
import { X, Zap, ArrowRight, Sparkles } from 'lucide-react';

const AnimatedBulkBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isMounted) return null;

  const content = {
    title: "Power Up Your Team",
    text: "Unlock exclusive volume pricing for bulk training access.",
    cta: "Get Bulk Discount",
    link: "/online-courses-combo"
  };

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shine {
          animation: shine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        /* NEW: Marquee Animation for Text */
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite; /* Adjust speed (15s) as needed */
          white-space: nowrap;
          display: inline-block;
          min-width: 100%;
        }
        /* Pause on hover so users can read it easily */
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div 
        className={`
          fixed left-0 right-0 z-50 mx-auto w-full max-w-8xl px-4 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isVisible ? 'top-[14%] translate-y-0 opacity-100' : '-top-20 -translate-y-10 opacity-0 pointer-events-none'}
        `}
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-blue-600/30" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500/40 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/40 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
            
            {/* LEFT SIDE */}
            <div className="flex flex-1 items-center gap-5 overflow-hidden text-center sm:text-left">
              
              <div className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg sm:flex">
                <div className="absolute inset-0 animate-pulse-glow rounded-xl bg-white/20 blur-sm" />
                <Zap className="relative h-6 w-6 text-white fill-white" />
                <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-yellow-300 animate-bounce delay-75" />
              </div>

              <div className="flex w-full flex-col gap-1 overflow-hidden">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                    {content.title}
                  </span>
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200 ring-1 ring-inset ring-indigo-500/40">
                    New
                  </span>
                </div>
                
                {/* --- MOVING TEXT SECTION --- */}
                {/* 'mask-image' creates a fade effect on left/right edges */}
                <div className="relative w-full max-w-md overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                  <p className="animate-marquee text-sm font-medium leading-relaxed text-indigo-100/90">
                    {content.text} &nbsp; • &nbsp; {content.text} {/* Duplicated for smoother looping look */}
                  </p>
                </div>
                {/* --------------------------- */}

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <a
                href={content.link}
                className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] sm:w-auto"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
                <span className="relative flex items-center gap-2">
                  {content.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </a>

              <button
                onClick={handleDismiss}
                className="group/close absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:static"
              >
                <X className="h-4 w-4 transition-transform duration-300 group-hover/close:rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedBulkBanner;






// 'use client';
// import React, { useState } from 'react';
// import { X, Zap, ArrowRight } from 'lucide-react'; // Or use any icon library

// const AnimatedBulkBanner = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   if (!isVisible) return null;

//   // HARDCODED CONTENT (No props passed)
//   const content = {
//     title: "Power Up Your Team",
//     text: "Unlock volume-based pricing on bulk courses for organizations and training programs.",
//     cta: "Claim Bulk Discount",
//     link: "/online-courses-combo"
//   };

//   return (
//     <>
//       {/* 
//         INLINE STYLES FOR ANIMATION 
//         (Keeps this component self-contained without touching tailwind.config.js)
//       */}
//       <style>{`
//         @keyframes gradient-x {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-x {
//           background-size: 200% 200%;
//           animation: gradient-x 6s ease infinite;
//         }
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
//       `}</style>

//       {/* BANNER CONTAINER */}
//       <div className="relative w-full animate-in slide-in-from-top duration-500">
//         <div className="animate-gradient-x bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-lg">
//           <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-y-3 px-4 py-3 text-white sm:px-6 md:flex-row lg:px-8">
            
//             {/* LEFT: Icon & Text */}
//             <div className="flex flex-1 items-center gap-4 text-center md:text-left">
//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
//                 <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
//               </span>
//               <div className="flex flex-col md:flex-row md:items-center md:gap-3">
//                 <span className="text-lg font-bold tracking-tight">
//                   {content.title}
//                 </span>
//                 <span className="hidden h-1 w-1 rounded-full bg-white/50 md:block"></span>
//                 <span className="text-sm font-medium text-indigo-100 md:text-base">
//                   {content.text}
//                 </span>
//               </div>
//             </div>

//             {/* RIGHT: CTA & Close */}
//             <div className="flex w-full items-center justify-center gap-4 md:w-auto">
//               <a
//                 href={content.link}
//                 className="group relative overflow-hidden rounded-full bg-white px-6 py-2 text-sm font-bold text-indigo-700 shadow-sm transition-transform hover:scale-105 hover:bg-indigo-50"
//               >
//                 {/* Shimmer Effect Overlay */}
//                 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer group-hover:animate-none" />
                
//                 <span className="relative flex items-center gap-2">
//                   {content.cta}
//                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </span>
//               </a>

//               <button
//                 onClick={() => setIsVisible(false)}
//                 className="absolute right-2 top-2 rounded-lg p-1 text-indigo-200 hover:bg-white/20 hover:text-white md:static"
//                 aria-label="Dismiss"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AnimatedBulkBanner;
