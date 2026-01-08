// app/prompt-library/[slug]/page.tsx

import BackButton from '@/components/common/BackButton';
import MarkdownViewer from '@/components/Home/PrompLibrary/MarkdownViewer';
import StudentApiService from '@/services/studentApi';
import Link from 'next/link';
import React from 'react';
import { FiClock } from 'react-icons/fi';
import { getCompleteUrl } from '@/lib/getCompleteUrl';
import PromptUserEmail from '@/components/Home/PrompLibrary/PromptUserEmail';
import { ArrowRight } from 'lucide-react';
import AnimatedBulkBanner from '@/components/Home/PrompLibrary/AnimatedBulkBanner';
import axios from 'axios';

type PageProps = {
  params: {
    slug: string;
  };
};

const fetchCourses = async () => {
  try {
    const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_courses/?all_data=true`);
    return data.data?.results || [];
  } catch (error) {
    console.error("error in fetching courselists", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const prompts: any = await StudentApiService.promptLibrariesBySlug(slug);
  const courses = await fetchCourses();

  const aiCourses = courses.filter((course: any) =>
    course?.category_name?.toLowerCase().includes('data science') ||
    course?.title?.toLowerCase().includes('data science')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 mt-12 px-4 sm:py-12">
      
      {/* Banner wrapper with overflow hidden */}
      <div className="w-full overflow-hidden mb-6">
         <AnimatedBulkBanner />
      </div>

      <div className="lg:hidden mb-6">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-1 min-w-0"> 
            
            {/* Header */}
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4 leading-tight">
                {prompts.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
                {prompts.description}
              </p>
            </div>

            {/* Public Content */}
            {prompts.public_content && (
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-gray-900/50 mb-6 lg:mb-8 overflow-hidden">
                <div className="overflow-x-auto">
                  <MarkdownViewer content={prompts.public_content} />
                </div>
              </div>
            )}

            <div className='py-4 overflow-hidden rounded-2xl'>
              <AICourseCard />
            </div>

            {/* Premium Content Locked Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-orange-200 dark:border-gray-700 p-6 sm:p-8 lg:p-12 xl:p-16 rounded-xl sm:rounded-2xl text-center">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 mx-auto">🔒</div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
                Premium Content Locked
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                Unlock exclusive prompts and advanced techniques
              </p>
              <PromptUserEmail />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 relative h-full">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Courses Box */}
              <div className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 shadow-lg">
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  Quick Courses
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-blue-100/90 leading-tight">
                  Learn in minutes. Upskill faster
                </p>
                <Link
                  href="/online-courses-combo"
                  className="
                    mt-4 inline-flex items-center justify-center gap-2
                    rounded-full bg-white px-3 py-2 sm:px-4
                    text-xs sm:text-sm font-semibold text-blue-700
                    shadow-md w-full sm:w-auto
                    animate-heartbeat
                    hover:animate-none
                    hover:scale-105
                    transition-all duration-300
                    text-center whitespace-normal
                  "
                >
                  Offer Going on Explore Bulk Courses
                </Link>
              </div>

              {/* Course Cards Container - SCROLLBAR HIDDEN */}
              <div className="space-y-3 sm:space-y-4 lg:pr-1.5 max-h-[calc(100vh-300px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {aiCourses.slice(0, 4).map((course: any) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.title
                      ?.toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/:/g, '-')
                      .replace(/[^a-z0-9\-]+/g, '')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '')}`}
                    className="group flex gap-3 p-3 hover:bg-white dark:hover:bg-gray-800 border border-gray-100/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={getCompleteUrl(course.banner)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    <div className="flex-1 min-w-0 py-0.5">
                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] sm:text-[11px] font-medium rounded-md mb-1 sm:mb-1.5">
                        {course.category_name}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm leading-tight line-clamp-2 mb-1">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <FiClock className="w-2.5 h-2.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {aiCourses.length > 4 && (
                  <Link
                    href="/courses"
                    className="block p-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      All Courses <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AICourseCard() {
  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-slate-900 rounded-2xl shadow-2xl sm:p-1">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-blue-600/20 to-emerald-500/10" />
      <div className="relative p-5 sm:p-8 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between gap-8 backdrop-blur-sm">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
              New Curriculum
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Upgrade Your Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block sm:inline">AI & Data Analytics</span> 🚀
            </h3>
          </div>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Step into the future with our industry-leading programs. Designed for students and professionals.
          </p>
          <div className="mt-8 md:mt-0 flex-shrink-0">
             <a href="/online-courses-combo" className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900">
                Explore Courses
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
