'use client'
import Image from 'next/image'
import React from 'react'
import img5 from "@/public/images/Ellipse5.png";
import collage from "@/public/images/COLLAG.png"
import { useDispatch, useSelector } from 'react-redux';
import { showLoginPopup } from '@/store/features/loginSlice';
import { selectAuth } from '@/store/features/authSlice';

function LearnerOutcomes() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);

  const handleJoin = () => {
    if (!isAuthenticated) {
      dispatch(showLoginPopup())
    }
  }

  const outcomes = [
    { number: "94%", text: "Completion Rate" },
    { number: "4.8/5", text: "Average Rating" },
    { number: "85%", text: "Career Advancement" },
    { number: "2.3x", text: "Faster Skill Growth" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images Section - Enhanced */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                <Image 
                  src={collage} 
                  alt="Students learning on TeacherCool platform" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Image Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-white rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm font-medium">Join 50k+ Learners</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">94%</h3>
                <p className="text-xs text-gray-600 font-medium">Success Rate</p>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">4.8</h3>
                <p className="text-xs text-gray-600 font-medium">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                  Proven Results
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transformative 
                <span className="text-blue-600 block">Learning Outcomes</span>
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
                <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="w-4 h-1.5 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                On TeacherCool, learners experience a transformative educational journey that 
                equips them with practical, in-demand skills. Each course is designed with 
                real-world applications in mind, helping students gain relevant knowledge that 
                directly impacts their career growth.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-gray-700 leading-relaxed">
                  Through interactive content and hands-on projects, students actively apply 
                  what they learn, building confidence and proficiency in a collaborative 
                  environment that fosters community and shared growth.
                </p>
              </div>
            </div>

            {/* Outcomes Grid */}
            <div className="grid grid-cols-2 gap-4">
              {outcomes.map((outcome, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {outcome.number}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {outcome.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={handleJoin}
                className="group relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-600 min-w-[180px]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Learning Free
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  No credit card required
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  Start instantly
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">50,000+</p>
                  <p className="text-gray-600">Active Learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        {/* <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Career-Focused",
                description: "Skills that employers actually want"
              },
              {
                icon: "💡",
                title: "Expert Instructors",
                description: "Learn from industry professionals"
              },
              {
                icon: "🔄",
                title: "Flexible Learning",
                description: "Learn at your own pace"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Background Decorative Image */}
      <Image
        src={img5}
        alt="Decorative element"
        className="absolute right-0 bottom-0 w-48 h-48 opacity-20"
      />
    </div>
  )
}

export default LearnerOutcomes