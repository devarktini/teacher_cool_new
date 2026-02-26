'use client'
import HomeApiService from '@/services/homeApi';
import React, { useEffect, useState } from 'react'

interface AboutThisCourseProps {
  id: any;
  type: "course" | "category";
}
interface AbhoutThisCourseData {
  title?: string;
  course_name?: string | null;
  category_name?: string | null;
  description?: string;
  points?: string[];

}
function AboutThisCourse({ id, type }: AboutThisCourseProps) {

    const [data, setData] = useState<AbhoutThisCourseData>({})
  
    const fetchDetails = async () => {
      try {
        const response: any = await HomeApiService.getSeoCourseByEntity(
           "about-course",
          type === "course"
            ? { course_id: id }
            : { category_id: id }
        );
  
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };
    
    useEffect(() => {
      if (id) fetchDetails();
    }, [id, type]);

  return (
    <div className='p-4'>
      <h1 className='font-bold text-2xl'>{data?.title}</h1>
      <p>{data?.description}</p>
      {/* <h1 className='font-bold text-2xl'>About This Course</h1>
      <p>This course is designed to help you learn and grow in your educational journey.</p> */}
    </div>
  )
}

export default AboutThisCourse
