import React from 'react'
import Image from 'next/image';
import batchstart from "@/public/images/Stats/batchstart.png";
import chat from "@/public/images/Stats/chat.png";
import career from "@/public/images/Stats/carrer.png";
import hiring from "@/public/images/Stats/hiring.png";
import duration from "@/public/images/Stats/duration.png";
import internship from "@/public/images/Stats/internshp.png";
import Link from 'next/link';

function ExploreCourses() {
    return (
        <div className="bg-background">
            {/* Stats Section */}
            <div className="flex flex-col md:flex-row  justify-around items-center px-4 py-6 bg-white shadow-md space-y-4 sm:space-y-0 sm:justify-center md:justify-around">
                {/* Header Section */}
                <div className="flex flex-col justify-between items-center px-6 py-4 bg-white shadow-md w-full sm:w-auto">
                    <div className="text-yellow-500 flex gap-2 md:flex-col md:gap-0 font-semibold text-center">
                        <div>Courses</div>
                        <div>Features</div>
                    </div>
                    <Link
                        // href={{
                        //     pathname: "/courses",
                        //     search: "?query=free",
                        // }}
                        href='/for-individual'
                        className="bg-yellow-500 text-white text-xl px-4 py-2 rounded font-medium  no-underline mt-4 sm:mt-2"
                    >
                        Explore All 
                    </Link>
                </div>

                {/* Stat Items */}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 place-items-center w-full md:w-fit lg:w-auto p-4 ">

                    {[
                        { headCounts: '231+', label: "Courses", src: batchstart },
                        { headCounts: '8000+', label: "Success Students", src: chat },
                        { headCounts: '250+', label: "Expert Tutor", src: career },
                        { headCounts: '24X7', label: "Support", src: hiring },
                        { headCounts: '120+', label: "Career Coach", src: duration },
                        { headCounts: '6 Months', label: "Internship", src: internship },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="text-center  lg:w-auto p-2 "
                        >
                            <div className="rounded-full p-1 w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 via-pink-500 to-cyan-500">
                                <div className="rounded-full w-full h-full bg-white p-2">
                                    <Image
                                        className="w-full h-full rounded-full"
                                        src={item.src}
                                        alt={item.label}
                                    />
                                </div>
                            </div>
                            <div className="text-xl font-bold text-black mt-2">{item.headCounts}</div>
                            <div className="text-gray-600 ">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExploreCourses
