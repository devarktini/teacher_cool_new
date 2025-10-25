'use client'
import Progress from '@/components/Progress';
import CourseProgress from '@/components/Students/CourseProgress';
import StudentApiService from '@/services/studentApi';
import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

function MyProgress() {
   const studentId = localStorage.getItem("id")
  const [courseData, setCourseData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    const fetchCourseData = async () => {
      if (studentId) {
        setLoading(true);
        try {
          const res = await StudentApiService.getCourseProgressByStudentId(studentId);
          // console.log("res", res);
          setCourseData(res?.data || []);
          setSearchResults(res?.data || []); 
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [studentId]);
   const handleChange = (e:any) => {
    const { value } = e.target;
    setQuery(value);

    if (value) {
      const filteredResults = courseData.filter((item:any) =>
        item?.course?.title?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(courseData);
    }
  };

  if (loading) return <Progress/>
  return (
    <div>
      {window.screen.width < 768 && (
        <div className="flex bg-white items-center p-2 gap-2 mx-2 h-10 rounded pr-1 border">
          <span>
            <IoSearchOutline />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="outline-none flex items-center justify-center w-[90%]"
          />
        </div>
      )}
     
      <div className="bg-white px-4 rounded-md shadow-md py-4 my-4">
        <div className="flex items-center p-2 gap-2 w-[100%] md:w-[40%] h-10 rounded pr-1 border">
          <span>
            <IoSearchOutline />
          </span>
          <input
            type="text"
            value={query}
            placeholder="Search..."
            onChange={handleChange}
            className="outline-none flex items-center justify-center w-[12rem] md:w-[20rem]"
          />
        </div>

       

        <div className="pt-4 flex flex-col gap-3">
          {(query ? searchResults : courseData)?.map((item:any, index:any) => (
            <CourseProgress
              key={index}
              index={index}
              progress={item?.progress}
              item={item?.course}
              percentage={72}
            />
          ))}
          {query && searchResults.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No results found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProgress
