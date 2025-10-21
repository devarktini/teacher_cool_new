'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pagination } from "antd";
import Image from 'next/image';
import DataAnalyticsWithPowerBI from '@/public/images/DataAnalyticswithPowerBI.jpg'
import HomeApiService from '@/services/homeApi';
import Link from 'next/link';
import { FaGreaterThan } from 'react-icons/fa6';
import Card from '@/components/ui/cards/Card';
import { useSearchParams } from 'next/navigation';
import styles from "./Courses.module.css";

// Define types
interface Course {
  id: string;
  category: string;
  [key: string]: any;
}

interface Category {
  id: string;
  cat_name: string;
  course_count: number;
}

interface FilterValue {
  id: string;
  value: string;
}

interface CoursesProps {
  query?: string;
}

function Courses({ query }: CoursesProps) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [filterCourse, setFilterCourse] = useState<Course[]>([]);
  const [showFilterBy, setShowFilterBy] = useState(false);
  const [courseCategory, setCourseCategory] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterValue, setFilterValue] = useState<FilterValue[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  const paginatedData = filterCourse.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const filterByData = [
    {
      heading: "Categories",
      value: courseCategory
        .filter((category) => category.course_count > 0)
        .map((category, index) => ({
          id: category.id,
          name: `${category.cat_name}`,
        })),
    },
    {
      heading: "Level",
      value: [
        { id: "level-1", name: "Beginner" },
        { id: "level-2", name: "Intermediate" },
        { id: "level-3", name: "Advanced" },
        { id: "level-4", name: "Beginner to Advanced" },
      ],
    },
  ];

  const handleFilterchange = (id: string, value: string) => {
    let newFilterValue = [...filterValue];
    if (!newFilterValue.some((item) => item.id === id)) {
      newFilterValue.push({ id, value });
    } else {
      newFilterValue = newFilterValue.filter((item) => item.id !== id);
    }

    setFilterValue(newFilterValue);
    
    if (newFilterValue.length === 0) {
      setFilterCourse(courseData);
    } else {
      const filteredCourseData = courseData.filter(
        (course) => newFilterValue.some(({ id }) => course.category === id)
      );
      setFilterCourse(filteredCourseData);
    }

    // Update URL parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (newFilterValue.length === 0) {
        params.delete("topic");
      } else {
        params.delete("topic");
        newFilterValue.forEach(({ value }) => {
          params.append("topic", value);
        });
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  // Get query parameter from URL if not passed as prop
  const queryParam = query || searchParams.get('query') || '';

  useEffect(() => {
    setLoading(true);
    
    HomeApiService.getCourseList()
      .then((res: any) => {
        if (res) {
          if (queryParam === "free") {
            setFilterCourse(res.results || []);
            setCourseData(res.results || []);
          } else {
            // Get category ID from URL path or query
            const pathSegments = window.location.pathname.split('/');
            const categoryIdFromPath = pathSegments[pathSegments.length - 1];
            
            const filterCourse = res.results?.filter((card: Course) => 
              card.category === queryParam || card.category === categoryIdFromPath
            ) || [];
            setFilterCourse(filterCourse);
            setCourseData(res.results || []);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });

    HomeApiService.getCategory().then((res: any) => {
      if (res) {
        setCourseCategory(res?.results || []);
      }
    });
  }, [queryParam]);

  return (
    <div ref={heroRef} className={`${styles.main_explore_hero} border-2`}>
      {/* section 1 */}
      {queryParam && (
        <div className={`${styles.explore_section1} md:w-[80%] w-[90%] m-auto p-6  rounded-lg shadow-lg`}>
          <div className="flex gap-2 items-center text-lg font-semibold text-gray-700 mb-4">
            <Link
              href='/'
              className="hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            >
              Home
            </Link>
            <FaGreaterThan className="text-blue-500 w-4 h-4" />
            <span className="underline transition-colors font-normal duration-300 cursor-pointer">
              {queryParam !== "free" ? queryParam : "Free Courses"}
            </span>
          </div>
          <div className="text-2xl hidden xl:block lg:block font-bold text-blue-700 mb-2">
            Learn Essential Skills for Free
          </div>
          <p className="text-base hidden xl:block lg:block text-gray-600">
            Free Courses: Explore a variety of free courses across different
            subjects. Gain new skills and knowledge without any financial
            investment.
          </p>
        </div>
      )}

      {/* Mobile Filter */}
      <div className={`relative flex flex-col gap-3 md:hidden ${showFilterBy ? "z-50" : "z-0"}`}>
        <div
          onClick={() => setShowFilterBy(!showFilterBy)}
          className={`flex p-2 items-center gap-3 w-[95%] m-auto ${
            !showFilterBy
              ? "sticky"
              : "fixed top-0 py-[0.6rem] ml-1 z-30 bg-white"
          }`}
        >
          {!showFilterBy ? (
            <div className="flex justify-between border border-1 border-blue-500 p-2 items-center w-[95%] mx-auto">
              <span>Filter By</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
              >
                <path
                  d="M17.8307 1.5H1.16406L7.83073 9.38333V14.8333L11.1641 16.5V9.38333L17.8307 1.5Z"
                  stroke="#0966ED"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="flex justify-between items-center w-[95%] mx-auto border-t border-gray-200 pt-4">
              <span className="text-lg font-semibold">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>

        {showFilterBy && (
          <div className="w-full">
            <div className="mt-5 flex flex-col gap-4 fixed top-6 w-full bg-white py-6 px-5 z-10 max-h-[100vh] overflow-y-auto shadow-lg rounded-lg">
              {filterByData.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="item_heading mb-2 text-lg font-bold text-gray-700">
                    {item.heading}
                  </div>
                  <div className="space-y-2">
                    {item.value.map((value, ind) => (
                      <div key={ind} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={value.id}
                          checked={filterValue.some(
                            (filter) => filter.id === value.id
                          )}
                          onChange={() =>
                            handleFilterchange(value.id, value.name)
                          }
                          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <label htmlFor={value.id} className="text-gray-600">
                          {value.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:w-[80%] w-[98%] m-auto md:flex items-start gap-5">
        {/* Desktop Filter */}
        <div className={`${styles.main_filter} sticky top-20 xl:h-screen h-0 scroll-smooth xl:bg-gray-50 bg-none rounded-lg xl:p-4 p-0 shadow-lg`}>
          <div className={`hidden md:block ${styles.main_filter_text}`}>Filter By</div>

          <div className="mt-5 hidden md:flex flex-col gap-5 overflow-y-auto">
            <ul className={`${styles.filter_list}`}>
              {filterByData.map((item, index) => (
                <li key={index} className={`${styles.filter_item}`}>
                  <div className="flex flex-col items-start gap-2">
                    <div className="filter_item_heading mb-1">
                      {item.heading}
                    </div>
                    <ul className="flex flex-col gap-2">
                      {item.value.map((value, ind) => (
                        <li key={ind} className={`${styles.filter_item}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={value.id}
                              checked={filterValue.some(
                                (filter) => filter.id === value.id
                              )}
                              onChange={() =>
                                handleFilterchange(value.id, value.name)
                              }
                              className="w-4 h-4"
                            />
                            <label
                              htmlFor={value.id}
                              className="text-sm text-gray-600"
                            >
                              {value.name}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Courses */}
        {loading ? (
          <div className="h-[17rem] w-full flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-2 mt-3">
              Loading...
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-500">
              Please wait while we fetch the data.
            </p>
          </div>
        ) : (
          <div className="flex-1">
            <div className={`${styles.main_course_heading} mx-auto`}>
              Choose the Free Course That Aligns Best With Your Educational Goals
            </div>

            <ExploreCourse
              courseData={paginatedData}
              col1={1}
              col2={2}
              col3={3}
            />

            <div className="py-4 w-fit mx-auto items-center md:w-full">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filterCourse.length}
                onChange={handlePageChange}
                showSizeChanger
                onShowSizeChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      <div className="relative py-4 mx-auto flex items-center justify-center md:w-full">
        <Image
          src={DataAnalyticsWithPowerBI}
          alt="Explore"
          className="max-w-full h-auto"
        />

        <div className="absolute bottom-2 left-2 text-white text-sm font-bold animate-blink">
          Blinking Text
        </div>
      </div>
    </div>
  );
}

export default Courses;

// ExploreCourse component remains the same
const ExploreCourse = (props: any) => {
  return (
    <>
      <div className="container mx-auto pb-10">
        <div
          className={`grid grid-cols-1 sm:grid-cols-${props.col1} md:grid-cols-${props.col2} lg:grid-cols-${props.col3} gap-5 py-5 max-sm:justify-items-center max-sm:grid-cols-1 max-sm:px-4`}
        >
          <Card data={props.courseData} />
        </div>
      </div>
    </>
  );
};