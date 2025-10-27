'use client'
import React, { useEffect, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Rate, Pagination } from "antd";
import { motion } from "framer-motion";
import StudentApiService from "@/services/studentApi";
import toast from "react-hot-toast";
import ProgressBar from "@/components/ui/ProgressBar";
import Progress from "@/components/Progress";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCourseBatch, clearCourseDetails, setCourseDetails } from "@/store/features/courseSlice";
const MyLearning = () => {
    const router = useRouter();
    const bannerImage =
        "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";

    const [enrollementData, setEnrollmentData] = useState([]);
    const [textVlaue, setTextValue] = useState(25);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchCourseData = async () => {
            const studentId = localStorage.getItem('id');
            if (!studentId) {
                toast.error('Something went wrong');
                return;
            }

            setLoading(true);
            try {
                const res = await StudentApiService.getCourseProgressByStudentId(studentId);
                setCourseData(res?.data || []);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, []);

    useEffect(() => {
        dispatch(clearCourseDetails())
        dispatch(clearCourseBatch())
    })


    const handleChange = (e: any) => {
        const { value } = e.target;
        setQuery(value);
        if (value) {
            const filteredResults = courseData.filter((item: any) =>
                item?.course?.title.toLowerCase().includes(value.toLowerCase())
            )
            setSearchResults(filteredResults);
        } else {
            setSearchResults(enrollementData)
        }

    }


    function truncateText(text: string, wordLimit: number) {
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return (
                <>
                    {words.slice(0, wordLimit).join(" ")}...{" "}
                    <span onClick={() => setTextValue(100000)} style={{ color: "red" }}>
                        read more
                    </span>
                </>
            );
        }
        return text;
    }


    const handleDispatch = (item: any) => {
        console.log(item)
        dispatch(setCourseDetails(item))
        router.push(`/dashboard/student/learn-course`);

    }

    return (
        <div className="container mx-auto">

            <div className="bg-white px-4 rounded-md shadow-md py-4 my-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex gap-3 items-center mb-4 md:mb-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={handleChange}
                                className="bg-white w-full md:w-96 h-10 rounded pl-9 pr-1 border outline-none"
                            />
                            <div className="absolute top-3 left-4">
                                <IoSearchOutline />
                            </div>
                        </div>
                    </div>
                    <span className="font-semibold font-Roboto text-lg text-[#1E1E1E]">
                        My Learnings
                    </span>
                </div>
                <div>
                    <span className="text-blue-500 text-lg font-semibold font-Roboto pt-4 pb-3 block">
                        All Courses
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-1md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            <>
                                <Progress />
                            </>
                        ) : courseData?.length > 0 ? (
                            (query ? searchResults : courseData)?.map((item: any, ind: number) => {
                                // console.log(item)
                                return (
                                    <div
                                        key={ind}
                                        className="border border-[#E2E8F0] rounded-md flex flex-col px-2 py-2 my-1 cursor-pointer"
                                        onClick={() => handleDispatch(item)}

                                    >
                                        {/* {console.log(item)} */}
                                        <motion.div className="hover:scale-110 hover:shadow-md transition duration-1000">
                                            <div className="px-1 flex items-center justify-center py-1">
                                                <img
                                                    // src={bannerImage}
                                                    src={item?.course?.banner ? getCompleteUrl(item?.course?.banner) : bannerImage}
                                                    alt="courses"
                                                    className="w-full h-[10rem] object-cover"
                                                />
                                            </div>
                                        </motion.div>
                                        <span className="text-lg font-Roboto font-semibold text-[#1E1E1E] text-opacity-80 pt-2 pb-1">
                                            {item?.course?.title}
                                        </span>
                                        <span className="text-xs font-Roboto text-[#1E1E1E] text-opacity-80 pb-1">
                                            {truncateText(item?.course?.description, textVlaue)}
                                        </span>
                                        <div className=" w-full">
                                            <ProgressBar
                                                bgcolor="#0966ED"
                                                progress={item?.progress > 100 ? 100 : item?.progress}
                                                width={"full"}
                                                height={7}
                                            />
                                        </div>
                                        <div className="flex gap-1 items-center pb-2">
                                            <Rate allowHalf defaultValue={4} />
                                            <span className="font-Roboto text-xs text-[#1E1E1E] text-opacity-80">{`(${1200} Ratings)`}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-[17rem] flex flex-col items-center justify-center">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-3 font-semibold text-gray-700 mb-2">
                                    You havn't enrolled in any of the course!
                                </h2>
                                <p className="text-base text-center sm:text-lg lg:text-xl text-gray-500 mb-6">
                                    Please browse course
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyLearning;
