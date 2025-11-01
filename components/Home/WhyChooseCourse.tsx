'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import img89 from '@/public/images/Frame89.png'
import img90 from '@/public/images/Frame90.png'

function WhyChooseCourse() {
  const [courseCount, setCourseCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [appUserCount, setAppUserCount] = useState(0);
  const [happyStudentCount, setHappyStudentCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startAnimation(setCourseCount, 231);
          startAnimation(setInstructorCount, 89);
          startAnimation(setAppUserCount, 12000);
          startAnimation(setHappyStudentCount, 72000);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  const startAnimation = (setCount: any, endValue: any) => {
    let start = 0;
    const duration = 2000;
    const stepTime = 10;
    const steps = duration / stepTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newCount = Math.min(
        start + (endValue - start) * (currentStep / steps),
        endValue
      );
      setCount(Math.floor(newCount));
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_0%,#ffffff_50%,#f8fafc_100%)] opacity-50"></div>
      
      {/* Minimal Decorations */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-50 rounded-full opacity-60"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-slate-50 rounded-full opacity-40"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content Section */}
          <div className="space-y-8" ref={ref}>
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">WHY CHOOSE US</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Learn from the 
                <span className="text-blue-600 block">Best Educators</span>
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-lg text-slate-600 leading-relaxed">
                Transform your career with industry-leading courses designed by top experts. 
                Our comprehensive curriculum blends theoretical knowledge with practical applications, 
                ensuring you gain skills that matter in today's competitive job market.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: `${courseCount}+`, label: 'Premium Courses', icon: '📚' },
                { value: `${instructorCount}+`, label: 'Expert Mentors', icon: '👨‍🏫' },
                { value: `${(appUserCount / 1000).toFixed(1)}k`, label: 'Active Learners', icon: '👥' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group text-center p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                >
                  <div className="text-2xl mb-2 opacity-70">{stat.icon}</div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Community Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[img89, img90, img89, img90, img89].map((img, index) => (
                      <div 
                        key={index}
                        className="relative transition-transform duration-300 hover:-translate-y-1"
                      >
                        <Image
                          src={img}
                          alt=""
                          className="h-12 w-12 rounded-full border-2 border-white shadow-md"
                        />
                      </div>
                    ))}
                    <div className="h-12 w-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center shadow-md">
                      <span className="text-slate-600 font-bold text-xs">+5k</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {`${(happyStudentCount / 1000).toFixed(1)}k+`}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm">Successful Graduates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="space-y-6">
            {/* Main Image Card */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100">
                <img
                  src='https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470'
                  alt="Learning experience"
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Satisfaction Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-center transform transition-all duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">⭐</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">95%</h1>
                    <p className="text-xs text-slate-600 font-medium">Success Rate</p>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Elite Learning Experience</h3>
                  <p className="text-slate-600 text-sm">Join thousands achieving career goals</p>
                </div>
              </div>
            </div>

            {/* Instructors Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[img89, img90, img89].map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`Instructor ${index + 1}`}
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <h3 className="text-xl font-bold text-blue-600">1.5k+ Experts</h3>
                  <p className="text-slate-500 text-sm font-medium">Industry Leaders</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  World-Class Instruction
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Learn from industry veterans and academic leaders who bring real-world expertise 
                  directly to your learning journey.
                </p>
                
                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Industry Experts', 'Mentorship', 'Career Guidance', 'Live Sessions'].map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-50 rounded-full text-slate-700 text-xs font-medium border border-slate-200 hover:border-slate-300 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center group hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">Career Focused</h4>
                <p className="text-slate-500 text-xs mt-1">Job-ready skills</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center group hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🔄</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">Flexible Learning</h4>
                <p className="text-slate-500 text-xs mt-1">Learn at your pace</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-blue-600">
              Start Learning Today
            </button>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🏆', label: 'Award Winning', sub: 'Courses' },
              { icon: '📈', label: 'Proven Results', sub: '95% Success' },
              { icon: '🌍', label: 'Global', sub: 'Community' },
              { icon: '💼', label: 'Career', sub: 'Support' }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="text-2xl mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                <p className="text-slate-500 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseCourse