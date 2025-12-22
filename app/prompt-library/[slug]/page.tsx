import BackButton from '@/components/common/BackButton';
import MarkdownViewer from '@/components/Home/PrompLibrary/MarkdownViewer';
import StudentApiService from '@/services/studentApi';
import HomeApiService from '@/services/homeApi';
import Link from 'next/link';
import React from 'react';
import { FiClock, FiStar, FiTag } from 'react-icons/fi';
import { getCompleteUrl } from '@/lib/getCompleteUrl';
import PromptUserEmail from '@/components/Home/PrompLibrary/PromptUserEmail';

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const prompts: any = await StudentApiService.promptLibrariesBySlug(slug);
  const coursesResponse = await HomeApiService.getCourseList();
  const courses: any = coursesResponse?.results || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="hidden lg:flex items-center justify-end mb-8">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 lg:gap-8">

          {/* Left Column - Expanded Reading Area */}
          <div className="lg:col-span-1">
            {/* Header */}
            <div className="text-center lg:text-left mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                {prompts.title}
              </h1>
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-3xl">{prompts.description}</p>
            </div>

            {/* Public Content */}
            {prompts.public_content && (
              <div className="bg-white p-6 lg:p-8 xl:p-10 rounded-2xl shadow-xl mb-8 lg:mb-10">
                <MarkdownViewer content={prompts.public_content} />
              </div>
            )}

            {/* Private Content */}
        
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-dashed border-orange-200 p-12 lg:p-16 rounded-2xl text-center">
                <div className="text-5xl mb-6 mx-auto">🔒</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Premium Content Locked</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Unlock exclusive prompts and advanced techniques
                </p>
                {/* <Link
                  href="/courses"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  Upgrade Now →
                </Link> */}
                <PromptUserEmail/>

              </div>
         
          </div>

          {/* Right Column - Minimized Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 h-fit">
              {/* Courses Header - Compact */}
              <div className="mb-6 p-4 lg:p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/25 rounded-lg">
                    <FiTag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">Quick Courses</h3>
                    <p className="text-xs text-blue-100 leading-tight">Learn in minutes</p>
                  </div>
                </div>
              </div>

              {/* Ultra Compact Course Cards */}
              {/* <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent"> */}
              <div className="space-y-3 pr-1.5">

                {courses.slice(0, 4).map((course: any) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.title
                  ?.toLowerCase()
                  // replace spaces (one or more) with a hyphen
                  .replace(/\s+/g, '-')
                  // replace colons with a hyphen
                  .replace(/:/g, '-')
                  // optionally remove any characters you don’t want (like punctuation)
                  .replace(/[^a-z0-9\-]+/g, '')
                  // optionally collapse consecutive hyphens into one
                  .replace(/-+/g, '-')
                  // optionally trim hyphens from start or end
                  .replace(/^-|-$/g, '')
          }`}
                className="group flex gap-3 p-3 hover:bg-white border border-gray-100/50 hover:border-blue-200 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white/20 backdrop-blur-sm hover:backdrop-blur-md"
                  >
                {/* Tiny Image */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={getCompleteUrl(course.banner)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {parseFloat(course.discount_percentage) > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                      {course.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* Compact Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  {/* Category - Smaller */}
                  <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-medium rounded-md mb-1.5 group-hover:bg-blue-200 transition-colors">
                    {course.category_name}
                  </span>

                  {/* Title - Smaller */}
                  <h4 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2 group-hover:text-blue-600 mb-1 transition-colors">
                    {course.title}
                  </h4>

                  {/* Meta - Ultra compact */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-2.5 h-2.5" />
                      <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <FiStar className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                      <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  {/* Price - Compact */}
                  <div className="text-xs font-bold text-blue-600">
                    ₹{parseFloat(course.discount_percentage) > 0 ? course.discount_price : course.price}
                    {parseFloat(course.discount_percentage) > 0 && (
                      <span className="text-[10px] text-gray-400 font-normal ml-1 line-through">
                        {course.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
                ))}

              {courses.length > 4 && (
                <Link
                  href="/courses"
                  className="block p-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  All Courses →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
}
