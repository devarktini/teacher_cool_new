'use client'
import React, { useEffect, useState } from 'react'
import Progress from '../Progress'
import CourseCard from '../ui/cards/CourseCard'
import HomeApiService from '@/services/homeApi'
import SecondaryButton from '../ui/Buttons/SecondaryButton'

function NewOnTeachercool() {
    const [catId, setCatId] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState<any[]>([]);
    const [viewAllCourses, setViewAllCourses] = useState(false);

    const fetchCourseLists = async()=>{
        try {
            const data = await HomeApiService.getCourseList()
            // console.log("co",data?.results)
            setCourseData(data?.results)
        } catch (error) {
            console.error("error in fetching courselists",error)
        }finally{
            setLoading(false)
        }
    }

  const fetchCat = async() =>{
    try {
        const data = await HomeApiService.getCategory()
        // console.log("cat", data?.results)
        setData(data?.results)
    } catch (error) {
        console.error(error)
    }finally{
        setLoading(false)
    }
  }

    useEffect(() => {
        fetchCourseLists();
        fetchCat();
    }, []);
    return (
        <>
            <div className="container lg:px-[7.25rem] md:px-8 mx-auto py-10">
                <div>
                    <h2 className="font-bold text-4xl sm:text-5xl px-4 sm:px-0">
                        <span className="text-blue-500">New</span> on TeacherCool
                    </h2>
                    <p className="text-sm pt-3 text-gray-600 xl:text-left text-justify px-3 sm:px-0">
                        Discover the latest updates on TeacherCool, the innovative Learning
                        Management System. Empower your learning journey with tools designed
                        for both educators and students.
                    </p>

                    <SecondaryButton data={data} setCatId={setCatId} />

                    {loading ? (
                        <div className="h-[17rem] w-full flex flex-col items-center justify-center">
                            <Progress />
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-2 mt-3">
                                Loading...
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-500">
                                Please wait while we fetch the data.
                            </p>
                        </div>
                    ) : courseData?.length > 0 ? (
                        <div className="flex">
                            <CourseCard
                                dataOne={
                                    catId
                                        ? courseData
                                            ?.filter((item) => item.category == catId)
                                            ?.slice(0, viewAllCourses ? courseData.length : 8)
                                        : courseData?.slice(
                                            0,
                                            viewAllCourses ? courseData.length : 8
                                        )
                                }
                            />
                        </div>
                    ) : (
                        <div className="h-[10rem] w-full flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                Data not found!
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Sorry, we couldn’t find the data you’re looking for. Please try
                                again later.
                            </p>
                        </div>
                    )}

                    {courseData.length > 4 && (
                        <div className="pt-8 py-2 max-sm:pl-6 max-sm:py-2">
                            <button
                                onClick={() => setViewAllCourses((prev) => !prev)}
                                className="bg-white text-blue-500 rounded-md text-base px-5 h-10 cursor-pointer border border-solid border-blue-400"
                            >
                                {viewAllCourses ? "View Less" : "View All Courses"}{" "}
                                <span>&raquo;</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default NewOnTeachercool
