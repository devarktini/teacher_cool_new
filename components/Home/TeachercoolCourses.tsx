'use client'
import React, { useEffect, useState } from 'react'
import HomeApiService from '@/services/homeApi'
import Progress from '../Progress';
import CardTwo from '../ui/cards/CardTwo';
function TeachercoolCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await HomeApiService.getCategory();
                // console.log("data", data.results)
                setCourses(data?.results);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <Progress />;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    
    return (
        <>
            <div
                // onClick={() => navigate("/courses")}
                className="container lg:px-[7.25rem] px-8 mx-auto py-10 max-sm:px-4 "
            >
                <div>
                    <h2 className="font-bold text-5xl max-sm:text-3xl ">
                        Explore TeacherCool <span className="text-blue-500">Courses</span>
                    </h2>
                    <p className="text-sm pt-1 text-gray-600 pr-1 ">
                        Explore TeacherCool courses and discover a world of knowledge
                        designed to elevate your skills and career.
                    </p>
                    <div>
                        <CardTwo data={courses} />
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeachercoolCourses
