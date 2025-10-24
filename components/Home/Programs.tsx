'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaChevronRight, FaHouse } from 'react-icons/fa6';
import HomeApiService from '@/services/homeApi'
import image from '@/public/images/image.png'
import { useRouter } from 'next/navigation';
import Progress from '../Progress';
interface ProgramsProps {
    onClose: () => void
}

function Programs({ onClose }: ProgramsProps) {
    const router = useRouter()
    const defaultBanner =
        "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [getCategoryData, setGetCategoryData] = useState([]);
    const [certificateCourse, setCertificateCourse] = useState<any>([]);
    const [degreeCourse, setDegreeCourse] = useState([]);
    const [activeTab, setActiveTab] = useState("certificate");
    const [activeCategoryName, setActiveCategoryName] = useState<string>(
        // getCategoryData?.[0]?.name || ""
        (getCategoryData && (getCategoryData as any)[0]?.name) || ""
    );


    useEffect(() => {
        // setLoading(true);
        HomeApiService.getCategoryByPublicAndPrivate()
            .then((res) => {
                if (res) {
                    // console.log(res.results);
                    setGetCategoryData(res.data);
                    //   setLoading(false);
                    setDegreeCourse(res.data[0]["micro degree"]);
                    setCertificateCourse(res.data[0]["certificate programme"]);
                }
            })
            .catch((error) => console.error(error));

    }, []);

    const handleMouseHover = (category: any, index: number) => {
        setActiveTab("certificate");
        setActiveIndex(index);
        console.log(category.name)
        setActiveCategoryName(category.name);
        setLoading(true);
        setDegreeCourse(category["micro degree"]);
        setCertificateCourse(category["certificate programme"]);
        // console.log("category", category);
    };

    const handleNavigate = (item:any) => {
        setLoading(true)
        router.push(`/courses/${item?.title.toLowerCase()?.replace(/\s+/g, "-")}/${item?.id}`)
        onClose()
        setLoading(false)
    }

    if(loading){
        <Progress/>
    }
    return (
        <div className=" border  top-0 shadow-xl z-[1000] fixed w-full bg-white border-t ">
            <div className="flex  relative h-screen bg-gray-100">
                <button
                    onClick={onClose}
                    className="absolute bg-gray-300 border-gray-400 border rounded-full p-2 right-4 top-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {/* Sidebar */}
                <aside className="w-72 bg-[#31b5d9]  text-white p-6 rounded-r-3xl shadow-xl animate-fade-in-left">
                    <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider">
                        Categories
                    </h2>
                    <ul className="space-y-3">
                        {getCategoryData?.map((category: any, index: number) => (
                            <li
                                onClick={() => handleMouseHover(category, index)}
                                key={index}
                                className={`${activeIndex === index
                                    ? "bg-[#3473dd]"
                                    : "hover:bg-[#4bc3e3]"
                                    } py-3 px-5  rounded-lg cursor-pointer transition-all duration-300 font-medium transform hover:scale-105`}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="flex-1  p-8 animate-fade-in-up">
                    <div className=" flex flex-row items-center justify-start mb-4 space-x-4">
                        <div className=" tooltip-top">
                            <FaHouse
                                className="w-[24px] h-[24px] text-[#767777] cursor-pointer"
                                onClick={() => {
                                    router.push('/');
                                    onClose()
                                }}
                            />
                        </div>
                        <div>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </div>
                        <div className=" text-xl text-gray-700 font-bold">
                            {activeCategoryName}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                    <div className="flex space-x-6 mt-4 border-b pb-2">
                        <span
                            className={`cursor-pointer transition-all duration-300 ${activeTab === "certificate"
                                ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
                                : "text-gray-500 hover:text-[#31b5d9]"
                                }`}
                            onClick={() => setActiveTab("certificate")}
                        >
                            Certificate Program
                        </span>

                        {degreeCourse?.length > 0 && (
                            <span
                                className={`cursor-pointer transition-all duration-300 ${activeTab === "micro"
                                    ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
                                    : "text-gray-500 hover:text-[#31b5d9]"
                                    }`}
                                onClick={() => setActiveTab("micro")}
                            >
                                Micro Degree
                            </span>
                        )}
                    </div>
                    {certificateCourse?.length > 0 || degreeCourse?.length > 0 ? (
                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 h-[85%]  overflow-y-scroll gap-2 mt-6">
                            {(activeTab === "certificate"
                                ? certificateCourse
                                : degreeCourse
                            )?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 max-h-44 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in border border-gray-100 flex flex-col justify-between"
                                >
                                    <div className="flex">
                                        <div className="bg-gradient-to-r w-1/4 from-[#31b5d9] to-[#4bc3e3] text-white h-20 rounded-lg">
                                            <img
                                                src={
                                                    item?.banner ? `${item?.banner}` : defaultBanner
                                                }
                                                alt="Course Banner"
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        <div className="flex pl-2 flex-col w-3/4 items-start text-sm text-gray-600 mb-1 ">
                                            <h3 className=" font-medium text-gray-700 text-sm mb-2">
                                                {item.title}
                                            </h3>
                                            <div className=" items-start flex-col xl:flex-row lg:flex-row xl:justiny-between lg:justify-between">
                                                {item.level !== "unknown" && (
                                                    <div className="flex whitespace-nowrap">
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-xs">{item.duration}</p>
                                                    </div>
                                                )}
                                                {item.level !== "unknown" && (
                                                    <div className="flex text-xs overflow-hidden pt-1 ">
                                                        {item.level}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <button
                                            // onClick={() => onClickNavigate(item?.id)}


                                            onClick={() => handleNavigate(item)}
                                            className="text-blue-500 font-medium"
                                        >
                                            Learn more <span>&raquo;</span>
                                        </button>
                                        {/* <Link
                                            // onClick={() => onClickNavigate(item?.id)}
                                           
                                            href={`/courses/${item?.title.toLowerCase()?.replace(/\s+/g, "-")}/${item?.id}`}
                                             onClick={onClose}
                                            className="text-blue-500 font-medium"
                                        >
                                            Learn more <span>&raquo;</span>
                                        </Link> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh]">
                            <svg
                                className="w-20 h-20 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No Courses Found
                            </h3>
                            <p className="text-gray-500">
                                There are no courses available in this category yet.
                            </p>
                        </div>
                    )}
                </main>

                {/* Right Side (Ads Section) */}
                <aside className="w-32 xl:w-48 lg:w-44  space-y-6 animate-fade-in-right">
                    {/* Promotional Image */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <Image
                            src={image}
                            alt="Promotional content"
                            className="w-full h-full object-cover"
                        />
                        <div className="p-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {/* Special Offer */}
                                Bulk Offer
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                Get 20% off on all courses this month!
                            </p>

                            <button className="mt-2 w-full bg-[#31b5d9] text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                                <Link
                                    href="/online-courses-combo"
                                // onClick={() => handleDropdownToggle()}
                                >
                                    Learn More
                                </Link>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Programs
