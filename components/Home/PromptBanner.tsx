'use client';
import Link from 'next/link';
import { FiArrowRight, FiZap } from 'react-icons/fi';

export default function PromptBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <FiZap className="w-4 h-4 mr-2" />
              100+ Expert AI Prompts Ready
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Master AI with 
              <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                {' '}Proven Prompts
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Unlock premium prompt libraries for content creation, coding, marketing & more. 
              Start creating like a pro today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/prompt-library" 
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:shadow-3xl"
              >
                Explore Prompts Library
                <FiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* <Link 
                href="/prompts" 
                className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm hover:border-blue-200 transition-all duration-300"
              >
                View All Collections
              </Link> */}
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="text-6xl font-bold text-white/20 mb-8">AI</div>
              <div className="space-y-3">
                <div className="h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="h-3 bg-white/20 rounded-full w-3/4 animate-pulse delay-200"></div>
                <div className="h-3 bg-blue-300/40 rounded-full w-1/2 animate-pulse delay-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
