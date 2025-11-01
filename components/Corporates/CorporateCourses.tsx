'use client'
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaSearch, FaPlay, FaClock, FaUsers, FaStar, FaArrowRight, FaFilter } from 'react-icons/fa';

interface Course {
  id: number;
  title: string;
  description: string;
  banner: string;
  duration?: string;
  level?: string;
  rating?: number;
  students?: number;
}

function CorporateCourses() {
    return (
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-white uppercase tracking-wide">
                            COURSE CATALOG
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        World-Class <span className="text-blue-200">Corporate Training</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Discover our comprehensive catalog of industry-leading courses designed to transform your workforce
                    </p>
                </div>
                <CoursesLists />
            </div>
        </section>
    )
}

export default CorporateCourses

const CoursesLists: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_corporate_courses/`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        const data: Course[] = response.data.map((course: any, index: number) => ({
          ...course,
          duration: ['2-4 weeks', '6-8 weeks', '4-6 weeks', '8-10 weeks'][index % 4],
          level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][index % 4],
          rating: Math.random() * 2 + 3, // Random rating between 3-5
          students: Math.floor(Math.random() * 5000) + 1000
        }));

        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on the search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Search and Filters Panel */}
      <div className="lg:col-span-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-white/80">
            <span className="text-sm">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
            </span>
            <FaFilter className="w-4 h-4" />
          </div>

          {/* Courses List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedCourse && selectedCourse.id === course.id
                    ? "bg-white/20 border-2 border-blue-300 shadow-lg"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between text-white/60 text-xs">
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span>{course.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Details Panel */}
      <div className="lg:col-span-2">
        {selectedCourse ? (
          <div className="bg-white flex flex-col rounded-2xl shadow-2xl overflow-hidden">
            {/* Course Banner */}
            <div className="relative h-64 lg:h-80">
              <img
                src={selectedCourse.banner}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  <FaPlay className="w-3 h-3" />
                  {selectedCourse.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {selectedCourse.title}
                    </h1>
                    
                    {/* Course Stats */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUsers className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{selectedCourse.students?.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaStar className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{selectedCourse.rating?.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      Course Overview
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  {/* <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-2">What You'll Learn</h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                      {[
                        "Industry-relevant skills",
                        "Practical applications",
                        "Expert-led instruction",
                        "Real-world projects",
                        "Career advancement",
                        "Networking opportunities"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </div>

                {/* Action Sidebar */}
                {/* <div className="lg:w-80 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Enroll Now</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <FaPlay className="w-4 h-4" />
                        Start Learning
                      </button>
                      <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                        <FaArrowRight className="w-4 h-4" />
                        View Curriculum
                      </button>
                    </div>
                    
                
                    <div className="mt-6 space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{selectedCourse.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-semibold">{selectedCourse.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-semibold">Self-Paced</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaSearch className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Course Selected</h3>
            <p className="text-gray-600">Select a course from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export { CoursesLists };