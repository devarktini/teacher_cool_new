'use client'
import Link from "next/link";
import React from "react";
import { getCompleteUrl } from "@/lib/getCompleteUrl";


const CardTwo = (props: any) => {
    const dummyImage = 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png';
 console.log("first", props.data)
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 px-2">
                {props?.data
                    ?.filter((item: any) => item.course_count > 0)
                    .map((item: any, ind: any) => (
                        <Link
                            href={`/courses?topic=${item.cat_name.replace(/\s+/g, '+')}`}
                            key={ind}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
                        >
                            
                            {/* Image */}
                            <div className="overflow-hidden rounded-t-xl">
                                <img
                                    className="w-full h-40 sm:h-44 md:h-48 object-center transform group-hover:scale-105 transition-transform duration-500"
                                    src={item?.banner ? getCompleteUrl(item.banner) : dummyImage}
                                    alt={item?.cat_name || "Course Category"}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 uppercase tracking-wide group-hover:text-indigo-600 transition-colors duration-200">
                                    {item?.cat_name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {item?.course_count} {item?.course_count > 1 ? "courses" : "course"}
                                </p>
                            </div>

                            {/* Subtle hover overlay effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        </Link>
                    ))}
            </div>
        </>

        // <>
        //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-5 max-sm:m-1 ">
        //     {props?.data
        //       ?.filter((item:any) => item.course_count > 0) 
        //       .map((item:any, ind:any) => (
        //         <Link
        //         href="#"
        //         //   to={`/courses/${item.id}`}
        //         //   state={{ id: item.id }}
        //           key={ind}
        //           className="mt-4 cursor-pointer border-solid min-h-16 border border-gray-200 hover:shadow-md rounded-lg"
        //         >
        //           <img
        //             className="w-full h-36 xl:h-36 lg::h-24 md:h-24  rounded-t-lg object-fill"
        //             src={item?.banner ? getCompleteUrl(item.banner) : dummyImage}
        //             alt="card-image"
        //           />
        //           <div className="py-1 pl-3">
        //             <h2 className="font-semibold text-sm text-gray-900 pt-3 uppercase">
        //               {item?.cat_name}
        //             </h2>
        //             <p className="text-sm pt-1 text-gray-600 pr-1">
        //               {item?.course_count} courses
        //             </p>
        //           </div>
        //         </Link>
        //       ))}
        //   </div>
        // </>
    );
};


export default CardTwo;
