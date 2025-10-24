import { getCompleteUrl } from '@/lib/getCompleteUrl';
import Link from 'next/link';
import React from 'react'
import { MdDelete } from 'react-icons/md';

function BookmarkCard({ wishList, loading, searchResults, handleDelete }: any) {
    const displayData = searchResults || wishList;
    return (
        <div className="p-4 ">
            <div className="h-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {!loading && displayData?.length > 0 ? (
                        displayData.map((item: any, index: any) => (

                            <div
                                className="bg-white w-[20rem]  rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 "
                            >
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={getCompleteUrl(item.course_details.banner)}
                                        alt={item.course_details.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="pt-4 pl-4 pr-4">
                                    <h2 className="text-base font-bold text-gray-800 mb-2">
                                        {item.course_details.title}
                                    </h2>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Price: {item.course_details.price}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Duration: {item.course_details.duration}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            Created:{" "}
                                            {new Date(item.created_at).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Updated:{" "}
                                            {new Date(item.updated_at).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </p>
                                    </div>


                                </div>

                                <div className="mb-3 flex justify-around items-center">
                                    <Link
                                        key={index}
                                        href={`/courses/${item?.title
                                            ?.toLowerCase()
                                            .replace(/\s+/g, '-')           // replace spaces with hyphens
                                            .replace(/:/g, '-')             // replace colons with hyphens
                                            .replace(/[^a-z0-9-]+/g, '')    // remove unwanted characters
                                            .replace(/-+/g, '-')            // collapse multiple hyphens
                                            .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
                                            }/${item?.id}`}
                                        className="bg-blue-500 px-3 py-2 rounded-md text-white no-underline">
                                        Explore
                                    </Link>
                                    <div
                                        className="text-red-500  right-2 top-2 text-2xl cursor-pointer"
                                        onClick={(e) => {

                                            handleDelete(item.id);
                                        }}
                                    >
                                        <MdDelete />
                                    </div>
                                </div>


                            </div>
                        ))
                    ) : !loading ? (
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            No data available
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            Loading...
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default BookmarkCard
