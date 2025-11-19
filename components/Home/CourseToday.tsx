'use client'
import React, { useEffect, useRef, useState } from 'react'
import Card from '../ui/cards/Card'
import Progress from '../Progress'
import Link from 'next/link'
import HomeApiService from '@/services/homeApi'
import { usePathname } from 'next/navigation' // ✅ Correct way in Next.js 13+

function CourseToday() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [courseData, setCourseData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()
  const studentHome = pathname === '/dashboard/student/home'

  useEffect(() => {
    const fetchListDashBoard = async () => {
      try {
        const data = await HomeApiService.getCourseList()
        setCourseData(data?.results || [])
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchListDashBoard()
  }, [])

  // ✅ Safe Scroll Functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // ✅ Render Helpers
  const renderLoading = () => (
    <div className="h-[17rem] w-full flex flex-col items-center justify-center">
      <Progress />
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-2 mt-3">
        Loading...
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-gray-500">
        Please wait while we fetch the data.
      </p>
    </div>
  )

  const renderEmpty = () => (
    <div className="h-[17rem] w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-3 font-semibold text-gray-700 mb-2">
        Data not found!
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-gray-500 mb-6">
        Sorry, we couldn’t find the data you’re looking for. Please try again later.
      </p>
    </div>
  )

  if (error) return <p className="text-red-500 text-center py-10">Error: {error}</p>

  return (
    // <div className="container lg:px-[7.25rem] md:px-8 mx-auto pt-5 pb-10 w-full bg-green-500">
    <div className={`container ${studentHome? 'lg:px-2':'lg:px-[7.25rem]'} md:px-8 mx-auto pt-5 pb-10 w-full `}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between flex-wrap">
        <h2 className="font-bold text-4xl max-sm:text-2xl max-sm:px-3 py-2">
          Get Started with your Courses Today!
        </h2>
        <Link
          href="/for-individual"
          className="font-medium text-base w-[10rem] h-8 flex justify-center items-center text-gray-900 hover:text-indigo-600 transition"
        >
          Explore all courses <span className="ml-1">&raquo;</span>
        </Link>
      </div>

      <p className="text-base pt-1 text-gray-500 font-medium pr-1 max-sm:px-3">
        Get started with your courses today and unlock new opportunities for learning and growth.
      </p>

      {/* ✅ Grid View for Student Home */}
      {studentHome ? (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 w-full">
        <div className="flex flex-wrap items-center justify-around gap-5 w-full mt-5">
          {loading
            ? renderLoading()
            : courseData.length > 0
            ? <Card data={courseData} />
            : renderEmpty()}
        </div>
      ) : (
        /* ✅ Scrollable Horizontal Cards */
        <div className="relative w-full mt-6">
          {/* {courseData.length >= 6 && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 z-40 bg-white opacity-90 transform -translate-y-1/2 text-black p-2 rounded-full shadow-md hidden md:block hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )} */}

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 py-5 px-2 md:px-4 scroll-container"
          >
            {loading
              ? renderLoading()
              : courseData.length > 0
              ? <Card data={courseData.slice(0, 6)} />
              : renderEmpty()}
          </div>

          {/* {courseData.length >= 6 && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 opacity-90 bg-white transform -translate-y-1/2 text-black p-2 rounded-full shadow-md hidden md:block hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )} */}
        </div>
      )}
    </div>
  )
}

export default CourseToday
