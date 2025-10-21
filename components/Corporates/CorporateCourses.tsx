'use client'
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
interface Course {
  id: number;
  title: string;
  description: string;
  banner: string;
}

function CorporateCourses() {
    return (
        <div className='bg-gradient-to-r from-[#05265D] to-[#0966ED] py-1 flex items-center justify-center mt-10'>
            <div className="flex flex-col w-full md:[95%] px-[5%]">
                <h1 className='text-center md:text-4xl font-bold text-3xl md:text-center text-white pt-5'>Search our catalog of world-class content</h1>
                <CoursesLists />
            </div>

        </div>
    )
}

export default CorporateCourses

const CoursesLists: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_corporate_courses/`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        console.log(response.data)

        const data: Course[] = response.data;
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]); // Default to the first course
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on the search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Left Panel */}
      <div className="p-4 h-full">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className="space-y-2 h-[500px] overflow-y-scroll">
          {filteredCourses.map((course) => (
            <li
              key={course.id}
              className={`p-2 cursor-pointer rounded ${
                selectedCourse && selectedCourse.id === course.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              {course.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="md:w-full p-6 text-white h-full">
        {selectedCourse ? (
          <div className="flex flex-col gap-4 lg:flex-row h-full">
            <div className="lg:w-1/2 xl:w-1/2">
              <h1 className="text-2xl font-bold mb-4">{selectedCourse.title}</h1>
              <img
                src={selectedCourse.banner}
                alt="Course Banner"
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded mb-4"
              />
            </div>

            <div className="lg:w-1/2 xl:w-1/2">
              <h2 className="text-xl font-semibold lg:mt-12">About</h2>
              <p>{selectedCourse.description}</p>
            </div>
          </div>
        ) : (
          <p>No course selected</p>
        )}
      </div>
    </div>
  );
};



