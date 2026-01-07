// app/prompt-library/[slug]/page.tsx

import BackButton from '@/components/common/BackButton';
import MarkdownViewer from '@/components/Home/PrompLibrary/MarkdownViewer';
import StudentApiService from '@/services/studentApi';
import HomeApiService from '@/services/homeApi';
import Link from 'next/link';
import React from 'react';
import { FiClock, FiStar, FiTag } from 'react-icons/fi';
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
    // console.log("coursesData", data.data?.results)
    return data.data?.results;

  } catch (error) {
    console.error("error in fetching courselists", error)
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const prompts: any = await StudentApiService.promptLibrariesBySlug(slug);
  // const coursesResponse = await HomeApiService.getCourseList();
  const courses = await fetchCourses();

  //  console.log("courses", courses)  
  // console.log('Prompt Library Details:', prompts)
  const aiCourses = courses.filter((course: any) =>
    course?.category_name?.toLowerCase().includes('data science') ||
    course?.title?.toLowerCase().includes('data science')
  );

  // console.log('Filtered Data Science Courses:', courses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-8 mt-12 px-4 sm:py-12">
      {/* Mobile Back Button */}

      <AnimatedBulkBanner />
      <div className="lg:hidden mb-6">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 lg:gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-1">
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
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-gray-900/50 mb-6 lg:mb-8">
                <MarkdownViewer content={prompts.public_content} />
              </div>
            )}

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
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-48 h-fit">
              {/* Courses Header */}
              <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl text-white shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/25 rounded-lg">
                    <FiTag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold leading-tight">
                      Quick Courses
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100/90 leading-tight">
                      Learn in minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Cards */}
              <div className="space-y-3 sm:space-y-4 lg:pr-1.5">

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
                      {parseFloat(course.discount_percentage) > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          {course.discount_percentage}%
                        </div>
                      )}
                    </div>


                    <div className="flex-1 min-w-0 py-0.5">

                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] sm:text-[11px] font-medium rounded-md mb-1 sm:mb-1.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                        {course.category_name}
                      </span>

                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 transition-colors">
                        {course.title}
                      </h4>


                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                        <div className="flex items-center gap-1">
                          <FiClock className="w-2.5 h-2.5" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <FiStar className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                          <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                        ₹{parseFloat(course.discount_percentage) > 0 ? course.discount_price : course.price}
                        {parseFloat(course.discount_percentage) > 0 && (
                          <span className="text-[10px] text-gray-400 font-normal ml-1 line-through">
                            {course.price}
                          </span>
                        )}

                        {/* <span className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-normal ml-1 ">
                               ₹{course.price}
                          </span> */}

                      </div>
                    </div>
                  </Link>
                ))}

                {/* View All Courses */}
                {aiCourses.length > 4 && (
                  <Link
                    href="/courses"
                    className="block p-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
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





// import BackButton from '@/components/common/BackButton';
// import MarkdownViewer from '@/components/Home/PrompLibrary/MarkdownViewer';
// import StudentApiService from '@/services/studentApi';
// import HomeApiService from '@/services/homeApi';
// import Link from 'next/link';
// import React, { useState } from 'react';
// import { FiClock, FiStar, FiTag } from 'react-icons/fi';
// import { getCompleteUrl } from '@/lib/getCompleteUrl';
// import PromptUserEmail from '@/components/Home/PrompLibrary/PromptUserEmail';
// import { X, Zap, ArrowRight } from 'lucide-react';
// import AnimatedBulkBanner from '@/components/Home/PrompLibrary/AnimatedBulkBanner';
// type PageProps = {
//   params: {
//     slug: string;
//   };
// };

// export default async function Page({ params }: PageProps) {
//   const { slug } = params;
//   const prompts: any = await StudentApiService.promptLibrariesBySlug(slug);
//   const coursesResponse = await HomeApiService.getCourseList();
//   const courses: any = coursesResponse?.results || [];

//   const aiCourses = courses.filter((course: any) =>
//     course?.category_name?.toLowerCase().includes('ai') ||
//     course?.title?.toLowerCase().includes('ai')
//   );
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
//       <>
//         <AnimatedBulkBanner />
//       </>
//       <div className="hidden lg:flex items-center justify-end mb-8 mt-5">
//         <BackButton />
//       </div>


//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 lg:gap-8">

//           {/* Left Column - Expanded Reading Area */}
//           <div className="lg:col-span-1">
//             {/* Header */}
//             <div className="text-center lg:text-left mb-12">
//               <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
//                 {prompts.title}
//               </h1>
//               <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-3xl">{prompts.description}</p>
//             </div>

//             {/* Public Content */}
//             {prompts.public_content && (
//               <div className="bg-white p-6 lg:p-8 xl:p-10 rounded-2xl shadow-xl mb-8 lg:mb-10">
//                 <MarkdownViewer content={prompts.public_content} />
//               </div>
//             )}

//             {/* Private Content */}

//             <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-dashed border-orange-200 p-12 lg:p-16 rounded-2xl text-center">
//               <div className="text-5xl mb-6 mx-auto">🔒</div>
//               <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Premium Content Locked</h3>
//               <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
//                 Unlock exclusive prompts and advanced techniques
//               </p>

//               <PromptUserEmail />

//             </div>

//           </div>

//           {/* Right Column - Minimized Sidebar */}
//           <div className="lg:col-span-1 hidden lg:block">
//             <div className="sticky top-24 h-fit">
//               {/* Courses Header - Compact */}
//               <div className="mb-6 p-4 lg:p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white shadow-xl">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 bg-white/25 rounded-lg">
//                     <FiTag className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold leading-tight">Quick Courses</h3>
//                     <p className="text-xs text-blue-100 leading-tight">Learn in minutes</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Ultra Compact Course Cards */}
//               <div className="space-y-3 pr-1.5">

//                 {aiCourses.slice(0, 4).map((course: any) => (
//                   <Link
//                     key={course.id}
//                     href={`/courses/${course.title
//                       ?.toLowerCase()
//                       // replace spaces (one or more) with a hyphen
//                       .replace(/\s+/g, '-')
//                       // replace colons with a hyphen
//                       .replace(/:/g, '-')
//                       // optionally remove any characters you don’t want (like punctuation)
//                       .replace(/[^a-z0-9\-]+/g, '')
//                       // optionally collapse consecutive hyphens into one
//                       .replace(/-+/g, '-')
//                       // optionally trim hyphens from start or end
//                       .replace(/^-|-$/g, '')
//                       }`}
//                     className="group flex gap-3 p-3 hover:bg-white border border-gray-100/50 hover:border-blue-200 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white/20 backdrop-blur-sm hover:backdrop-blur-md"
//                   >
//                     {/* Tiny Image */}
//                     <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-sm">
//                       <img
//                         src={getCompleteUrl(course.banner)}
//                         alt={course.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                       />
//                       {parseFloat(course.discount_percentage) > 0 && (
//                         <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
//                           {course.discount_percentage}%
//                         </div>
//                       )}
//                     </div>

//                     {/* Compact Info */}
//                     <div className="flex-1 min-w-0 py-0.5">
//                       {/* Category - Smaller */}
//                       <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-medium rounded-md mb-1.5 group-hover:bg-blue-200 transition-colors">
//                         {course.category_name}
//                       </span>

//                       {/* Title - Smaller */}
//                       <h4 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2 group-hover:text-blue-600 mb-1 transition-colors">
//                         {course.title}
//                       </h4>

//                       {/* Meta - Ultra compact */}
//                       <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
//                         <div className="flex items-center gap-1">
//                           <FiClock className="w-2.5 h-2.5" />
//                           <span>{course.duration}h</span>
//                         </div>
//                         <div className="flex items-center gap-0.5">
//                           <FiStar className="w-2.5 h-2.5 text-yellow-400 fill-current" />
//                           <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
//                         </div>
//                       </div>

//                       {/* Price - Compact */}
//                       <div className="text-xs font-bold text-blue-600">
//                         ₹{parseFloat(course.discount_percentage) > 0 ? course.discount_price : course.price}
//                         {parseFloat(course.discount_percentage) > 0 && (
//                           <span className="text-[10px] text-gray-400 font-normal ml-1 line-through">
//                             {course.price}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 ))}

//                 {aiCourses.length > 4 && (
//                   <Link
//                     href="/courses"
//                     className="block p-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
//                   >
//                     All Courses →
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div >
//   );
// }

