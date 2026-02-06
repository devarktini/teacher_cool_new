'use client'
import { getCompleteUrl } from '@/lib/getCompleteUrl';
import { Rate } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react'

function RecommendedCourse({ data ,title}: any) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-Inter font-semibold text-[32px] text-[#1E1E1E]">
                    {title}
                </h1>
                <h1 className="text-blue-500 font-Inter font-semibold text-[32px]">
                    Courses
                </h1>
            </div>
            <RecomendCoursecard courseData={data} />
        </>
    );
}

export default RecommendedCourse;

const RecomendCoursecard = ({ courseData }: any) => {
    const router = useRouter();
    const data = Array.isArray(courseData) ? courseData : [];

    const handleNavigation = (item: any) => {
        const slug = item.title
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/:/g, '-')
            .replace(/[^a-z0-9\-]+/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        if (typeof window !== 'undefined') {
            localStorage.setItem('courseId', item?.id);
        }

        // router.push(`/courses/${slug}/${item?.id}`);
        router.push(`/courses/${slug}`);
    };

    return (
        <div className="my-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <div
                            key={index}
                            className="border border-[#E2E8F0] rounded-md shadow-md flex flex-col transition duration-700 hover:scale-110 px-2 py-2 my-1"
                        >
                            <div className="px-1 py-1">
                                <img
                                    src={getCompleteUrl(item.banner)}
                                    alt="courses"
                                    className="w-full h-[150px] rounded-t-md"
                                />
                            </div>

                            <span className="text-lg font-Roboto font-medium text-[#1E1E1E] text-opacity-80 pt-2 pb-1">
                                {item.title}
                            </span>

                            <span className="text-sm font-Roboto text-[#1E1E1E] text-opacity-80 pb-1 pt-1">
                                {item.description.split(" ").splice(0, 15).join(" ")}
                                {item.description.split(" ").length > 15 && (
                                    <button
                                        onClick={() => handleNavigation(item)}
                                        className="text-blue-500 text-sm font-semibold"
                                    >
                                        <span className="px-1">
                                            Learn more <span>&raquo;</span>
                                        </span>
                                    </button>
                                )}
                            </span>

                            <div className="flex gap-1 items-center my-2">
                                <Rate allowHalf value={item.average_rating} disabled />
                                <span className="font-Roboto text-xs text-[#1E1E1E] text-opacity-80">
                                    ({item.average_rating} Ratings)
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 my-2">
                                <span className="text-xs font-Roboto text-[#1E1E1E] text-opacity-95 px-2 py-1 rounded-md bg-[#EEF2FF]">
                                    {item.duration} hours
                                </span>
                                <span className="text-xs font-Roboto text-[#1E1E1E] text-opacity-95 px-2 py-1 rounded-md bg-[#EEF2FF]">
                                    {item.level}
                                </span>
                                <span className="text-xs font-Roboto text-[#1E1E1E] text-opacity-95 px-2 py-1 rounded-md bg-[#EEF2FF]">
                                    {item.price}
                                </span>
                                {item.visibility && (
                                    <span className="text-xs font-Roboto text-[#1E1E1E] text-opacity-95 px-2 py-1 rounded-md bg-[#EEF2FF]">
                                        Free
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No courses available.</p>
                )}
            </div>
        </div>
    );
};
