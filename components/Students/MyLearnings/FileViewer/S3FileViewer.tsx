'use client'
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import ViewDetaiils from './ViewDetails';
import toast from 'react-hot-toast';

export default function S3FileViewer({ courseId }:any) {
  // console.log("Course ID:", courseId);

  const [blogs, setBlogs] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

    const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}lms/private-course-contents/by-course/`,
        {
          params: {
            course_id: courseId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

    //  console.log("Fetched data:", response);
      const data = response.data;
     
      if (Array.isArray(data)) {
        setBlogs(data);
      } else if (data?.results && Array.isArray(data.results)) {
        setBlogs(data.results);
      } else {
        console.warn("Unexpected data format:", data);
        setBlogs([]);
      }
    } catch (error) {
      // console.error("Error fetching notes:", error);
      toast.error("Error fetching notes");
      setBlogs([]);
    }
  };



  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const handleClick = (data:any) => {
    setIsOpen(true);
    setCurrentContent(data);
    // You can add logic here to handle the click event, like opening a modal or redirecting
  };

  // console.log("Blogs:", blogs);

  return (
    <>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Notes and Documents</h2>
        {blogs?.length > 0 ? (
          <ul className="space-y-3">
            {blogs?.map((blog:any, index:any) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded shadow-sm hover:bg-gray-50"
              >
                <div>
                  <p><strong>{blog?.name}</strong></p>
                  <p>{blog.course_title}</p>
                </div>
                <div onClick={() => handleClick(blog)}
                  className='cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200'>
                  view
                </div>

              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading documents...</p>
        )}
      </div>

      {

        isOpen && (
          <ViewDetaiils
            currentContent={currentContent}
            setIsOpen={setIsOpen}
            setCurrentContent={setCurrentContent}
          />
        )
      }
    </>
  );
}


