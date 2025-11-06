'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pagination, Spin } from "antd";
import Image from 'next/image';
import DataAnalyticsWithPowerBI from '@/public/images/DataAnalyticswithPowerBI.jpg'
import HomeApiService from '@/services/homeApi';
import Link from 'next/link';
import { FaGreaterThan, FaFilter } from 'react-icons/fa6';
import { MdClear } from 'react-icons/md';
import Card from '@/components/ui/cards/Card';
import { useSearchParams } from 'next/navigation';
import styles from "./Courses.module.css";
import { FaSearch, FaTimes } from 'react-icons/fa';


// Define types
interface Course {
  id: string;
  category: string;
  level?: string;
  title: string;
  description?: string;
  image?: string;
  price?: number | string;
  rating?: number;
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
  type: 'category' | 'level';
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
  const [pageSize, setPageSize] = useState(12);
  const [filterValue, setFilterValue] = useState<FilterValue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const paginatedData = filterCourse.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };


  // Get topic parameter from URL
  const topicParam = searchParams.get('topic') || query || '';
  // console.log("dd", topicParam)

  // Function to find category ID by name
  const findCategoryIdByName = (categoryName: string): string => {
    const decodedName = decodeURIComponent(categoryName.replace(/\+/g, ' '));
    const category = courseCategory.find(cat => 
      cat.cat_name.toLowerCase() === decodedName.toLowerCase()
    );
    return category?.id || decodedName;
  };


  // Function to find category name by ID
  const findCategoryNameById = (categoryId: string): string => {
    const category = courseCategory.find(cat => cat.id === categoryId);
    return category?.cat_name || categoryId;
  };


  // Dynamic filter data with counts
  const filterByData = [
    {
      heading: "Categories",
      type: "category" as const,
      value: courseCategory
        .filter((category) => category.course_count > 0)
        .map((category) => ({
          id: category.id,
          name: `${category.cat_name} (${category.course_count})`,
          count: category.course_count,
          originalName: category.cat_name
        })),
    },
    {
      heading: "Level",
      type: "level" as const,
      value: [
        { 
          id: "beginner", 
          name: "Beginner", 
          count: filterCourse.filter(course => 
            course.level?.toLowerCase().includes('beginner')
          ).length 
        },
        { 
          id: "intermediate", 
          name: "Intermediate", 
          count: filterCourse.filter(course => 
            course.level?.toLowerCase().includes('intermediate')
          ).length 
        },
        { 
          id: "advanced", 
          name: "Advanced", 
          count: filterCourse.filter(course => 
            course.level?.toLowerCase().includes('advanced')
          ).length 
        },
        { 
          id: "all-levels", 
          name: "All Levels", 
          count: filterCourse.filter(course => 
            !course.level || course.level.toLowerCase().includes('all')
          ).length 
        },
      ],
    },
  ];


  // Function to apply filters
  const applyFilters = (filters: FilterValue[], search: string = '', data: Course[] = courseData, freeOnly: boolean = false) => {
    let filteredData = [...data];


    // Apply search filter
    if (search.trim()) {
      filteredData = filteredData.filter(course =>
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase())
      );
    }


    // Apply category and level filters
    if (filters.length > 0) {
      const categoryFilters = filters.filter(f => f.type === 'category').map(f => f.id);
      const levelFilters = filters.filter(f => f.type === 'level').map(f => f.id);


      filteredData = filteredData.filter((course) => {
        // Check category filters
        const matchesCategory = categoryFilters.length === 0 || 
          categoryFilters.includes(course.category);


        // Check level filters
        const matchesLevel = levelFilters.length === 0 || 
          (course.level && levelFilters.some(level => {
            const courseLevel = course.level?.toLowerCase() || '';
            if (level === 'beginner') return courseLevel.includes('beginner');
            if (level === 'intermediate') return courseLevel.includes('intermediate');
            if (level === 'advanced') return courseLevel.includes('advanced');
            if (level === 'all-levels') return !courseLevel || courseLevel.includes('all');
            return false;
          }));


        return matchesCategory && matchesLevel;
      });
    }


    // Apply price filter for free courses
    if (freeOnly) {
      filteredData = filteredData.filter(course => 
        course.price === "0.00" || 
        course.price === 0 || 
        course.price === "0" ||
        !course.price
      );
    }


    setFilterCourse(filteredData);
    setCurrentPage(1);
  };


  const handleFilterChange = (id: string, value: string, type: 'category' | 'level') => {
    let newFilterValue = [...filterValue];
    
    const existingFilterIndex = newFilterValue.findIndex(item => item.id === id);
    
    if (existingFilterIndex === -1) {
      newFilterValue.push({ id, value, type });
    } else {
      newFilterValue = newFilterValue.filter((item) => item.id !== id);
    }


    setFilterValue(newFilterValue);
    applyFilters(newFilterValue, searchTerm, courseData, showFreeOnly);
  };


  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(filterValue, term, courseData, showFreeOnly);
  };


  // STEP 1: Load categories on component mount
  useEffect(() => {
    HomeApiService.getAllCategory()
      .then((res: any) => {
        if (res) {
          const categories = res?.results || [];
          setCourseCategory(categories);
          setCategoriesLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategoriesLoaded(true);
      });
  }, []);


  // STEP 2: Load courses on component mount
  useEffect(() => {
    HomeApiService.getCourseList()
      .then((res: any) => {
        if (res) {
          const allCourses = res.results || [];
          setCourseData(allCourses);
          setCoursesLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setCoursesLoaded(true);
      });
  }, []);


  // STEP 3: Apply filters once both categories and courses are loaded
  useEffect(() => {
    // Don't proceed until both are loaded
    if (!categoriesLoaded || !coursesLoaded || courseData.length === 0) {
      return;
    }


    let filteredCourses = courseData;
    let initialFilters: FilterValue[] = [];
    let isFreeOnly = false;


    // If topic parameter exists, use it
    if (topicParam) {
      // Check if topicParam indicates free courses
      if (topicParam.toLowerCase() === 'free') {
        isFreeOnly = true;
        filteredCourses = courseData.filter(course =>
          course.price === "0.00" || 
          course.price === 0 || 
          course.price === "0" ||
          !course.price
        );
      } else {
        const categoryId = findCategoryIdByName(topicParam);
        
        filteredCourses = courseData.filter((course: any) => {
          const courseCategoryName = findCategoryNameById(course.category);
          return (
            course.category === categoryId || 
            courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ') ||
            course.category?.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
          );
        });


        const categoryName = courseCategory.find(cat => cat.id === categoryId)?.cat_name || topicParam.replace(/\+/g, ' ');
        initialFilters.push({
          id: categoryId,
          value: categoryName,
          type: 'category'
        });
      }
    } else {
      // If no topic param, select the FIRST category automatically
      if (courseCategory.length > 0) {
        const firstCategory = courseCategory[0];
        
        filteredCourses = courseData.filter((course: any) => 
          course.category === firstCategory.id
        );


        initialFilters.push({
          id: firstCategory.id,
          value: firstCategory.cat_name,
          type: 'category'
        });
      }
    }


    setShowFreeOnly(isFreeOnly);
    setFilterValue(initialFilters);
    setFilterCourse(filteredCourses);
    setLoading(false);
  }, [categoriesLoaded, coursesLoaded, courseData, courseCategory, topicParam]);


  // Clear all filters
  const clearAllFilters = () => {
    setFilterValue([]);
    setSearchTerm('');
    setShowFreeOnly(false);
    
    // If there's a topicParam, reapply it, otherwise reapply first category
    if (topicParam) {
      if (topicParam.toLowerCase() === 'free') {
        const filteredCourses = courseData.filter(course =>
          course.price === "0.00" || 
          course.price === 0 || 
          course.price === "0" ||
          !course.price
        );
        setFilterCourse(filteredCourses);
        setShowFreeOnly(true);
      } else {
        const categoryId = findCategoryIdByName(topicParam);
        const filteredCourses = courseData.filter(course => {
          const courseCategoryName = findCategoryNameById(course.category);
          return (
            course.category === categoryId || 
            courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
          );
        });
        setFilterCourse(filteredCourses);
        const categoryName = courseCategory.find(cat => cat.id === categoryId)?.cat_name || topicParam.replace(/\+/g, ' ');
        setFilterValue([{
          id: categoryId,
          value: categoryName,
          type: 'category'
        }]);
      }
    } else {
      // Select first category
      if (courseCategory.length > 0) {
        const firstCategory = courseCategory[0];
        const filteredCourses = courseData.filter((course: any) => 
          course.category === firstCategory.id
        );
        setFilterCourse(filteredCourses);
        setFilterValue([{
          id: firstCategory.id,
          value: firstCategory.cat_name,
          type: 'category'
        }]);
      }
    }
    
    setCurrentPage(1);
  };


  // Remove individual filter
  const removeFilter = (filterId: string) => {
    const newFilters = filterValue.filter(f => f.id !== filterId);
    setFilterValue(newFilters);
    
    if (newFilters.length === 0) {
      // If all filters removed, reapply default
      if (topicParam) {
        if (topicParam.toLowerCase() === 'free') {
          const filteredCourses = courseData.filter(course =>
            course.price === "0.00" || 
            course.price === 0 || 
            course.price === "0" ||
            !course.price
          );
          setFilterCourse(filteredCourses);
          setShowFreeOnly(true);
        } else {
          const categoryId = findCategoryIdByName(topicParam);
          const filteredCourses = courseData.filter(course => {
            const courseCategoryName = findCategoryNameById(course.category);
            return (
              course.category === categoryId || 
              courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
            );
          });
          setFilterCourse(filteredCourses);
          const categoryName = courseCategory.find(cat => cat.id === categoryId)?.cat_name || topicParam.replace(/\+/g, ' ');
          setFilterValue([{
            id: categoryId,
            value: categoryName,
            type: 'category'
          }]);
        }
      } else {
        if (courseCategory.length > 0) {
          const firstCategory = courseCategory[0];
          const filteredCourses = courseData.filter((course: any) => 
            course.category === firstCategory.id
          );
          setFilterCourse(filteredCourses);
          setFilterValue([{
            id: firstCategory.id,
            value: firstCategory.cat_name,
            type: 'category'
          }]);
        }
      }
    } else {
      applyFilters(newFilters, searchTerm, courseData, showFreeOnly);
    }
  };


  // Get display name for breadcrumb and title
  const getDisplayCategory = () => {
    if (!topicParam) return "All Courses";
    
    if (topicParam.toLowerCase() === 'free') return "Free Courses";
    
    const decodedTopic = decodeURIComponent(topicParam.replace(/\+/g, ' '));
    const category = courseCategory.find(cat => 
      cat.id === topicParam || 
      cat.cat_name.toLowerCase() === decodedTopic.toLowerCase()
    );
    return category ? category.cat_name : decodedTopic;
  };


  // Check if a filter is the main topic/default filter
  const isTopicFilter = (filterId: string) => {
    if (topicParam) {
      if (topicParam.toLowerCase() === 'free') {
        return false; // Free filter is not shown in the active filters
      }
      return filterId === findCategoryIdByName(topicParam);
    } else if (courseCategory.length > 0) {
      return filterId === courseCategory[0].id;
    }
    return false;
  };


  return (
    <div ref={heroRef} className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <FaGreaterThan className="w-3 h-3" />
            <Link href="/courses" className="hover:text-blue-600 transition-colors">
              All Courses
            </Link>
            {topicParam && (
              <>
                <FaGreaterThan className="w-3 h-3" />
                <span className="text-blue-600 font-medium">
                  {getDisplayCategory()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Bar - Search and Filter Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
          {/* Search Bar */}
          <div className="w-full lg:w-64 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>


          {/* Filter Toggle and Results Info */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilterBy(!showFilterBy)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFilter className="w-4 h-4" />
              Filters
              {filterValue.length > 1 && (
                <span className="bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {filterValue.length - 1}
                </span>
              )}
            </button>
          </div>
        </div>


        {/* Active Filters */}
        {(filterValue.length > 1 || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{searchTerm}"
                <button onClick={() => handleSearch('')} className="hover:text-blue-900">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterValue
              .filter(filter => !isTopicFilter(filter.id))
              .map((filter) => (
                <span
                  key={filter.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {filter.value}
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="hover:text-gray-900"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <MdClear className="w-4 h-4" />
              Clear filters
            </button>
          </div>
        )}


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {filterValue.length > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>


              <div className="space-y-6">
                {filterByData.map((section, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      {section.heading}
                    </h4>
                    <div className="space-y-2">
                      {section.value.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={filterValue.some(f => f.id === item.id)}
                              onChange={() => handleFilterChange(item.id, item.name.split(' (')[0], section.type)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900">
                              {item.name.split(' (')[0]}
                            </span>
                          </div>
                          {item.count > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.count}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Mobile Filter Overlay */}
          {showFilterBy && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowFilterBy(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {filterByData.map((section, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {section.heading}
                        </h4>
                        <div className="space-y-2">
                          {section.value.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={filterValue.some(f => f.id === item.id)}
                                  onChange={() => handleFilterChange(item.id, item.name.split(' (')[0], section.type)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-gray-700">
                                  {item.name.split(' (')[0]}
                                </span>
                              </div>
                              {item.count > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {item.count}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Courses Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spin size="large" />
                <p className="text-gray-600 mt-4 text-lg">Loading courses...</p>
              </div>
            ) : (
              <>
                {filterCourse.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                      {paginatedData.map((course) => (
                        <Card key={course.id} data={[course]} />
                      ))}
                    </div>


                    {/* Pagination */}
                    {filterCourse.length > pageSize && (
                      <div className="flex justify-center mt-12">
                        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
                          <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filterCourse.length}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total, range) => 
                              `${range[0]}-${range[1]} of ${total} courses`
                            }
                            pageSizeOptions={['12', '24', '36', '48']}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;





// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import { Pagination, Spin } from "antd";
// import Image from 'next/image';
// import DataAnalyticsWithPowerBI from '@/public/images/DataAnalyticswithPowerBI.jpg'
// import HomeApiService from '@/services/homeApi';
// import Link from 'next/link';
// import { FaGreaterThan, FaFilter } from 'react-icons/fa6';
// import { MdClear } from 'react-icons/md';
// import Card from '@/components/ui/cards/Card';
// import { useSearchParams } from 'next/navigation';
// import styles from "./Courses.module.css";
// import { FaSearch, FaTimes } from 'react-icons/fa';

// // Define types
// interface Course {
//   id: string;
//   category: string;
//   level?: string;
//   title: string;
//   description?: string;
//   image?: string;
//   price?: number;
//   rating?: number;
//   [key: string]: any;
// }

// interface Category {
//   id: string;
//   cat_name: string;
//   course_count: number;
// }

// interface FilterValue {
//   id: string;
//   value: string;
//   type: 'category' | 'level';
// }

// interface CoursesProps {
//   query?: string;
// }

// function Courses({ query }: CoursesProps) {
//   const searchParams = useSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [courseData, setCourseData] = useState<Course[]>([]);
//   const [filterCourse, setFilterCourse] = useState<Course[]>([]);
//   const [showFilterBy, setShowFilterBy] = useState(false);
//   const [courseCategory, setCourseCategory] = useState<Category[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(12);
//   const [filterValue, setFilterValue] = useState<FilterValue[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const heroRef = useRef<HTMLDivElement>(null);
//   const paginatedData = filterCourse.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page: number, size: number) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   // Get topic parameter from URL - FIXED: using 'topic' instead of 'query'
//   const topicParam = searchParams.get('topic') || query || '';
//   // console.log("Topic Parameter:", topicParam);

//   const filterByData = [
//     {
//       heading: "Categories",
//       type: "category" as const,
//       value: courseCategory
//         .filter((category) => category.course_count > 0)
//         .map((category) => ({
//           id: category.id,
//           name: `${category.cat_name} (${category.course_count})`,
//           count: category.course_count,
//           originalName: category.cat_name
//         })),
//     },
//     {
//       heading: "Level",
//       type: "level" as const,
//       value: [
//         { id: "beginner", name: "Beginner", count: 0 },
//         { id: "intermediate", name: "Intermediate", count: 0 },
//         { id: "advanced", name: "Advanced", count: 0 },
//         { id: "all-levels", name: "All Levels", count: 0 },
//       ],
//     },
//   ];

//   // Count courses by level for filter counts
//   useEffect(() => {
//     if (courseData.length > 0) {
//       const levelCounts = {
//         beginner: courseData.filter(course => 
//           course.level?.toLowerCase().includes('beginner')
//         ).length,
//         intermediate: courseData.filter(course => 
//           course.level?.toLowerCase().includes('intermediate')
//         ).length,
//         advanced: courseData.filter(course => 
//           course.level?.toLowerCase().includes('advanced')
//         ).length,
//         'all-levels': courseData.filter(course => 
//           !course.level || course.level.toLowerCase().includes('all')
//         ).length,
//       };

//       // Update filter data with counts
//       filterByData[1].value = filterByData[1].value.map(level => ({
//         ...level,
//         count: levelCounts[level.id as keyof typeof levelCounts] || 0
//       }));
//     }
//   }, [courseData]);

//   // Function to apply filters
//   const applyFilters = (filters: FilterValue[], search: string = '') => {
//     let filteredData = [...courseData];

//     // Apply search filter
//     if (search.trim()) {
//       filteredData = filteredData.filter(course =>
//         course.title?.toLowerCase().includes(search.toLowerCase()) ||
//         course.description?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Apply category and level filters
//     if (filters.length > 0) {
//       const categoryFilters = filters.filter(f => f.type === 'category').map(f => f.id);
//       const levelFilters = filters.filter(f => f.type === 'level').map(f => f.id);

//       filteredData = filteredData.filter((course) => {
//         // Check category filters
//         const matchesCategory = categoryFilters.length === 0 || 
//           categoryFilters.includes(course.category);

//         // Check level filters
//         const matchesLevel = levelFilters.length === 0 || 
//           (course.level && levelFilters.some(level => {
//             const courseLevel = course.level?.toLowerCase() || '';
//             if (level === 'beginner') return courseLevel.includes('beginner');
//             if (level === 'intermediate') return courseLevel.includes('intermediate');
//             if (level === 'advanced') return courseLevel.includes('advanced');
//             if (level === 'all-levels') return !courseLevel || courseLevel.includes('all');
//             return false;
//           }));

//         return matchesCategory && matchesLevel;
//       });
//     }

//     setFilterCourse(filteredData);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (id: string, value: string, type: 'category' | 'level') => {
//     let newFilterValue = [...filterValue];
    
//     const existingFilterIndex = newFilterValue.findIndex(item => item.id === id);
    
//     if (existingFilterIndex === -1) {
//       newFilterValue.push({ id, value, type });
//     } else {
//       newFilterValue = newFilterValue.filter((item) => item.id !== id);
//     }

//     setFilterValue(newFilterValue);
//     applyFilters(newFilterValue, searchTerm);
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     applyFilters(filterValue, term);
//   };

//   // Function to find category ID by name
//   const findCategoryIdByName = (categoryName: string): string => {
//     const decodedName = decodeURIComponent(categoryName.replace(/\+/g, ' '));
//     const category = courseCategory.find(cat => 
//       cat.cat_name.toLowerCase() === decodedName.toLowerCase()
//     );
//     console.log("Finding category:", decodedName, "Found:", category);
//     return category?.id || decodedName;
//   };

//   // Function to find category name by ID
//   const findCategoryNameById = (categoryId: string): string => {
//     const category = courseCategory.find(cat => cat.id === categoryId);
//     return category?.cat_name || categoryId;
//   };

//   // Initialize with all courses and apply topicParam filter
//   useEffect(() => {
//     setLoading(true);
    
//     HomeApiService.getCourseList()
//       .then((res: any) => {
//         if (res) {
//           const allCourses = res.results || [];
//           setCourseData(allCourses);
//           console.log("Total courses:", allCourses.length);

//           let filteredCourses = allCourses;
//           let initialFilters: FilterValue[] = [];

//           // Apply topicParam filter if it exists
//           if (topicParam) {
//             const categoryId = findCategoryIdByName(topicParam);
//             console.log("Filtering by topic:", topicParam, "Category ID:", categoryId);
            
//             // Filter courses by category ID or name
//             filteredCourses = allCourses.filter((course:any) => {
//               const courseCategoryName = findCategoryNameById(course.category);
//               return (
//                 course.category === categoryId || 
//                 courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ') ||
//                 course.category?.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
//               );
//             });

//             // Add to initial filters if we found matching courses
//             if (filteredCourses.length > 0) {
//               initialFilters.push({
//                 id: categoryId,
//                 value: topicParam.replace(/\+/g, ' '),
//                 type: 'category'
//               });
//             }

//             console.log("Filtered courses count:", filteredCourses.length);
//             console.log("Initial filters:", initialFilters);
//           }

//           setFilterCourse(filteredCourses);
//           setFilterValue(initialFilters);
          
//           setLoading(false);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching courses:', error);
//         setLoading(false);
//       });

//     HomeApiService.getAllCategory().then((res: any) => {
//       if (res) {
//         const categories = res?.results || [];
//         setCourseCategory(categories);
//         console.log("Loaded categories:", categories);
//       }
//     });
//   }, [topicParam]);

//   // Clear all filters
//   const clearAllFilters = () => {
//     setFilterValue([]);
//     setSearchTerm('');
    
//     // If there's a topicParam, reapply it, otherwise show all courses
//     if (topicParam) {
//       const categoryId = findCategoryIdByName(topicParam);
//       const filteredCourses = courseData.filter(course => {
//         const courseCategoryName = findCategoryNameById(course.category);
//         return (
//           course.category === categoryId || 
//           courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
//         );
//       });
//       setFilterCourse(filteredCourses);
//       setFilterValue([{
//         id: categoryId,
//         value: topicParam.replace(/\+/g, ' '),
//         type: 'category'
//       }]);
//     } else {
//       setFilterCourse(courseData);
//     }
    
//     setCurrentPage(1);
//   };

//   // Remove individual filter
//   const removeFilter = (filterId: string) => {
//     const newFilters = filterValue.filter(f => f.id !== filterId);
//     setFilterValue(newFilters);
    
//     // If removing the topicParam filter and no other filters, show courses based on topicParam
//     if (newFilters.length === 0 && topicParam) {
//       const categoryId = findCategoryIdByName(topicParam);
//       const filteredCourses = courseData.filter(course => {
//         const courseCategoryName = findCategoryNameById(course.category);
//         return (
//           course.category === categoryId || 
//           courseCategoryName.toLowerCase() === topicParam.toLowerCase().replace(/\+/g, ' ')
//         );
//       });
//       setFilterCourse(filteredCourses);
//       setFilterValue([{
//         id: categoryId,
//         value: topicParam.replace(/\+/g, ' '),
//         type: 'category'
//       }]);
//     } else {
//       applyFilters(newFilters, searchTerm);
//     }
//   };

//   // Get display name for breadcrumb and title
//   const getDisplayCategory = () => {
//     if (!topicParam) return "All Courses";
    
//     // Decode URL parameter (convert "Data+Science" to "Data Science")
//     const decodedTopic = decodeURIComponent(topicParam.replace(/\+/g, ' '));
    
//     // Try to find the category name from courseCategory
//     const category = courseCategory.find(cat => 
//       cat.id === topicParam || 
//       cat.cat_name.toLowerCase() === decodedTopic.toLowerCase()
//     );
//     return category ? category.cat_name : decodedTopic;
//   };

//   // Check if a filter is the main topic filter (not user-added)
//   const isTopicFilter = (filterId: string) => {
//     return topicParam && filterId === findCategoryIdByName(topicParam);
//   };

//   return (
//     <div ref={heroRef} className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="container mx-auto px-4 py-8">
//           {/* Breadcrumb */}
//           <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
//             <Link href="/" className="hover:text-blue-600 transition-colors">
//               Home
//             </Link>
//             <FaGreaterThan className="w-3 h-3" />
//             <Link href="/courses" className="hover:text-blue-600 transition-colors">
//               All Courses
//             </Link>
//             {topicParam && (
//               <>
//                 <FaGreaterThan className="w-3 h-3" />
//                 <span className="text-blue-600 font-medium">
//                   {getDisplayCategory()}
//                 </span>
//               </>
//             )}
//           </div>

       
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Top Bar - Search and Filter Toggle */}
//         <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
//           {/* Search Bar */}
//           <div className="w-full lg:w-64 relative">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => handleSearch('')}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <FaTimes className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Filter Toggle and Results Info */}
//           <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
//             {/* <div className="text-sm text-gray-600">
//               Showing <span className="font-semibold">{filterCourse.length}</span> {topicParam ? getDisplayCategory().toLowerCase() : ''} courses
//               {(filterValue.length > (topicParam ? 1 : 0) || searchTerm) ? ' (filtered)' : ''}
//             </div> */}
            
//             {/* Mobile Filter Button */}
//             <button
//               onClick={() => setShowFilterBy(!showFilterBy)}
//               className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <FaFilter className="w-4 h-4" />
//               Filters
//               {filterValue.length > (topicParam ? 1 : 0) && (
//                 <span className="bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
//                   {filterValue.length - (topicParam ? 1 : 0)}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Active Filters - Show only user-added filters, not the main topic filter */}
//         {(filterValue.length > (topicParam ? 1 : 0) || searchTerm) && (
//           <div className="flex flex-wrap gap-2 mb-6">
//             {searchTerm && (
//               <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                 Search: "{searchTerm}"
//                 <button onClick={() => handleSearch('')} className="hover:text-blue-900">
//                   <FaTimes className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {filterValue
//               .filter(filter => !isTopicFilter(filter.id))
//               .map((filter) => (
//                 <span
//                   key={filter.id}
//                   className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
//                 >
//                   {filter.value}
//                   <button
//                     onClick={() => removeFilter(filter.id)}
//                     className="hover:text-gray-900"
//                   >
//                     <FaTimes className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             <button
//               onClick={clearAllFilters}
//               className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
//             >
//               <MdClear className="w-4 h-4" />
//               Clear filters
//             </button>
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Desktop Filter Sidebar */}
//           <div className="hidden lg:block w-80 flex-shrink-0">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                 {filterValue.length > (topicParam ? 1 : 0) && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Clear filters
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-6">
//                 {filterByData.map((section, index) => (
//                   <div key={index}>
//                     <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
//                       {section.heading}
//                     </h4>
//                     <div className="space-y-2">
//                       {section.value.map((item) => (
//                         <label
//                           key={item.id}
//                           className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                           <div className="flex items-center gap-3">
//                             <input
//                               type="checkbox"
//                               checked={filterValue.some(f => f.id === item.id)}
//                               onChange={() => handleFilterChange(item.id, item.name.split(' (')[0], section.type)}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                             />
//                             <span className="text-gray-700 group-hover:text-gray-900">
//                               {item.name.split(' (')[0]}
//                             </span>
//                           </div>
//                           {item.count > 0 && (
//                             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                               {item.count}
//                             </span>
//                           )}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filter Overlay */}
//           {showFilterBy && (
//             <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
//               <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-lg font-semibold">Filters</h3>
//                     <button
//                       onClick={() => setShowFilterBy(false)}
//                       className="p-2 hover:bg-gray-100 rounded-lg"
//                     >
//                       <FaTimes className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <div className="space-y-6">
//                     {filterByData.map((section, index) => (
//                       <div key={index}>
//                         <h4 className="font-semibold text-gray-900 mb-3">
//                           {section.heading}
//                         </h4>
//                         <div className="space-y-2">
//                           {section.value.map((item) => (
//                             <label
//                               key={item.id}
//                               className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="checkbox"
//                                   checked={filterValue.some(f => f.id === item.id)}
//                                   onChange={() => handleFilterChange(item.id, item.name.split(' (')[0], section.type)}
//                                   className="w-4 h-4 text-blue-600"
//                                 />
//                                 <span className="text-gray-700">
//                                   {item.name.split(' (')[0]}
//                                 </span>
//                               </div>
//                               {item.count > 0 && (
//                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                                   {item.count}
//                                 </span>
//                               )}
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Courses Grid */}
//           <div className="flex-1">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <Spin size="large" />
//                 <p className="text-gray-600 mt-4 text-lg">Loading courses...</p>
//               </div>
//             ) : (
//               <>
//                 {filterCourse.length === 0 ? (
//                   <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
//                     <div className="text-6xl mb-4">🔍</div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                       No {topicParam ? getDisplayCategory().toLowerCase() : ''} courses found
//                     </h3>
//                     <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                       {topicParam 
//                         ? `No courses found in ${getDisplayCategory()}. Try adjusting your search terms or filters.`
//                         : 'Try adjusting your search terms or filters to find what you\'re looking for.'
//                       }
//                     </p>
//                     <button
//                       onClick={clearAllFilters}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       {topicParam ? `View All ${getDisplayCategory()} Courses` : 'Clear all filters'}
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//                       {paginatedData.map((course) => (
//                         <Card key={course.id} data={[course]} />
//                       ))}
//                     </div>

//                     {/* Pagination */}
//                     {filterCourse.length > pageSize && (
//                       <div className="flex justify-center mt-12">
//                         <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
//                           <Pagination
//                             current={currentPage}
//                             pageSize={pageSize}
//                             total={filterCourse.length}
//                             onChange={handlePageChange}
//                             showSizeChanger
//                             showQuickJumper
//                             showTotal={(total, range) => 
//                               `${range[0]}-${range[1]} of ${total} ${topicParam ? getDisplayCategory().toLowerCase() : ''} courses`
//                             }
//                             pageSizeOptions={['12', '24', '36', '48']}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// }

// export default Courses;