'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, ArrowRight, Sparkles, Users, Trophy, Shield, TrendingUp } from 'lucide-react';

const AnimatedBulkBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
      startProgressAnimation();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const startProgressAnimation = () => {
    let start:any = null;
    const duration = 5000; // 5 seconds for progress bar
    
    const animate = (timestamp: any) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      
      if (percentage < 100) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Optional: Store dismissal in localStorage
    localStorage.setItem('bulkBannerDismissed', 'true');
  };

  if (!isMounted) return null;

  const features = [
    { icon: Users, text: "Team Training", color: "from-cyan-500 to-blue-500" },
    { icon: Trophy, text: "Certifications", color: "from-amber-500 to-orange-500" },
    { icon: Shield, text: "Secure Access", color: "from-emerald-500 to-green-500" },
    { icon: TrendingUp, text: "Progress Tracking", color: "from-purple-500 to-pink-500" }
  ];

  const content = {
    title: "Power Up Your Team",
    subtitle: "Enterprise-Grade Learning Solutions",
    text: "Unlock exclusive volume pricing for bulk training access. Save up to 40% on team subscriptions.",
    cta: "Get Bulk Discount",
    link: "/online-courses-combo",
    badge: "Limited Time Offer",
    discount: "Save 40%"
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes slide-in-blurred {
          0% {
            transform: translateY(-100px) scale(0.9);
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(99, 102, 241, 0.5); }
          50% { text-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        
        @keyframes marquee-smooth {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        
        @keyfeatures icons-float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 1000px 100%;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-slide-in-blurred {
          animation: slide-in-blurred 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-icons-float {
          animation: icons-float 3s ease-in-out infinite;
        }
        
        .animate-marquee-smooth {
          animation: marquee-smooth 25s linear infinite;
          animation-play-state: running;
        }
        
        .pause-animation:hover .animate-marquee-smooth {
          animation-play-state: paused;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-marquee-smooth {
            animation-duration: 15s;
          }
        }
      `}</style>

      <div 
        ref={bannerRef}
        className={`
          fixed left-0 right-0 z-[100] mx-auto w-full max-w-[1920px] px-3 sm:px-6 lg:px-8
          transition-all duration-1000 ease-out
          ${isVisible 
            ? 'top-4 sm:top-6 lg:top-20 translate-y-0 opacity-100 pointer-events-auto' 
            : '-top-full opacity-0 pointer-events-none'
          }
        `}
      >
        <div className="animate-slide-in-blurred">
          <div className="group relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-white/20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-blue-600/20 animate-gradient-shift" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff22 1px, transparent 1px),
                                 linear-gradient(to bottom, #ffffff22 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-float"
                  style={{
                    width: `${Math.random() * 40 + 20}px`,
                    height: `${Math.random() * 40 + 20}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                  }}
                />
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Main Content */}
            <div className="relative px-4 py-5 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                
                {/* Left Section with Icon and Title */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Animated Icon Container */}
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-ring rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 shadow-2xl">
                      <div className="absolute inset-0 animate-shimmer rounded-2xl" />
                      <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white animate-icons-float" />
                      <Sparkles className="absolute -right-2 -top-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 animate-bounce" />
                      <div className="absolute -bottom-2 -left-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </div>
                    </div>
                  </div>

                  {/* Title and Badge */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent animate-text-glow">
                        {content.title}
                      </h2>
                      <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {content.discount}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-medium">
                      {content.subtitle}
                    </p>
                  </div>
                </div>

                {/* Center Section - Marquee Features */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="pause-animation">
                    <div className="flex animate-marquee-smooth space-x-8 sm:space-x-12">
                      {[...features, ...features].map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 min-w-max"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">
                              {feature.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Mobile Feature Dots */}
                  <div className="mt-4 flex justify-center gap-2 sm:hidden">
                    {features.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                          Math.floor(progress / 25) === idx 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 w-4' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Section - CTA Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={content.link}
                    className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-3.5 sm:px-8 sm:py-4 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95"
                  >
                    <div className="absolute inset-0 animate-shimmer" />
                    <div className="relative flex items-center justify-center gap-3">
                      <span className="text-sm sm:text-base tracking-wide">
                        {content.cta}
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-300" />
                  </a>
                  
                  {/* Close Button */}
                  <button
                    onClick={handleDismiss}
                    className="group/close flex h-10 w-10 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110 hover:border-white/20"
                    aria-label="Dismiss banner"
                  >
                    <X className="h-5 w-5 transition-transform duration-300 group-hover/close:rotate-90" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover/close:border-white/20 transition-all duration-300" />
                  </button>
                </div>
              </div>

              {/* Additional Info Line */}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                  <Shield className="h-4 w-4" />
                  <span>Trusted by 500+ companies worldwide</span>
                </div>
                <div className="text-xs text-gray-400 text-center sm:text-right">
                  Offer ends in <span className="text-amber-400 font-bold">48:15:32</span>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedBulkBanner;



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { X, Zap, ArrowRight, Sparkles } from 'lucide-react';

// const AnimatedBulkBanner = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//     const timer = setTimeout(() => setIsVisible(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleDismiss = () => {
//     setIsVisible(false);
//   };

//   if (!isMounted) return null;

//   const content = {
//     title: "Power Up Your Team",
//     text: "Unlock exclusive volume pricing for bulk training access.",
//     cta: "Get Bulk Discount",
//     link: "/online-courses-combo"
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes shine {
//           0% { transform: translateX(-100%) skewX(-15deg); }
//           100% { transform: translateX(200%) skewX(-15deg); }
//         }
//         .animate-shine {
//           animation: shine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
//         }
//         @keyframes pulse-glow {
//           0%, 100% { opacity: 0.6; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.1); }
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 3s ease-in-out infinite;
//         }
//         /* NEW: Marquee Animation for Text */
//         @keyframes marquee {
//           0% { transform: translateX(100%); }
//           100% { transform: translateX(-100%); }
//         }
//         .animate-marquee {
//           animation: marquee 15s linear infinite; /* Adjust speed (15s) as needed */
//           white-space: nowrap;
//           display: inline-block;
//           min-width: 100%;
//         }
//         /* Pause on hover so users can read it easily */
//         .group:hover .animate-marquee {
//           animation-play-state: paused;
//         }
//       `}</style>

//       <div 
//         className={`
//           fixed left-0 right-0 z-50 mx-auto w-full max-w-8xl px-4 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
//           ${isVisible ? 'top-[14%] translate-y-0 opacity-100' : '-top-20 -translate-y-10 opacity-0 pointer-events-none'}
//         `}
//       >
//         <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-blue-600/30" />
//           <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500/40 blur-3xl" />
//           <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/40 blur-3xl" />

//           <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
            
//             {/* LEFT SIDE */}
//             <div className="flex flex-1 items-center gap-5 overflow-hidden text-center sm:text-left">
              
//               <div className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg sm:flex">
//                 <div className="absolute inset-0 animate-pulse-glow rounded-xl bg-white/20 blur-sm" />
//                 <Zap className="relative h-6 w-6 text-white fill-white" />
//                 <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-yellow-300 animate-bounce delay-75" />
//               </div>

//               <div className="flex w-full flex-col gap-1 overflow-hidden">
//                 <div className="flex items-center justify-center gap-2 sm:justify-start">
//                   <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
//                     {content.title}
//                   </span>
//                   <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200 ring-1 ring-inset ring-indigo-500/40">
//                     New
//                   </span>
//                 </div>
                
//                 {/* --- MOVING TEXT SECTION --- */}
//                 {/* 'mask-image' creates a fade effect on left/right edges */}
//                 <div className="relative w-full max-w-md overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
//                   <p className="animate-marquee text-sm font-medium leading-relaxed text-indigo-100/90">
//                     {content.text} &nbsp; • &nbsp; {content.text} {/* Duplicated for smoother looping look */}
//                   </p>
//                 </div>
//                 {/* --------------------------- */}

//               </div>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:flex-row">
//               <a
//                 href={content.link}
//                 className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] sm:w-auto"
//               >
//                 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
//                 <span className="relative flex items-center gap-2">
//                   {content.cta}
//                   <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
//                 </span>
//               </a>

//               <button
//                 onClick={handleDismiss}
//                 className="group/close absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:static"
//               >
//                 <X className="h-4 w-4 transition-transform duration-300 group-hover/close:rotate-90" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AnimatedBulkBanner;



