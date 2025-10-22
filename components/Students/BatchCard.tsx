'use client'
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
const BatchCard = ({ batchData }:any) => {
 
  const [selectedBatch, setSelectedBatch] = useState(null);


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {batchData?.map((item:any, ind:any) => (
              <div
                key={ind}
                className={`relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 
                ${item.status === "in_progress"
                    ? "border-[3px] border-green-500"
                    : item.status === "close"
                      ? "border-[3px] border-red-500"
                      : "border-[3px] border-gray-300"}`}
              >
                {/* Status indicator strip */}
                <div
                  className={`absolute top-0 left-0 w-full h-1
                  ${item.status === "in_progress"
                      ? "bg-green-500"
                      : item.status === "closed"
                        ? "bg-red-500"
                        : "bg-gray-300"}`}
                />

                <div className="p-1">
                  <div className=" ">
                    <h3 className="text-xl text-center font-bold text-gray-800">
                      {item.name}
                    </h3>
                  </div>

                  <div className={` mb-2 py-1 rounded-full text-center font-semibold
                      ${item.status === "in_progress"
                      ? "bg-green-100 text-green-700"
                      : item.status === "closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"}`}
                  >
                    {item.status.replace('_', ' ')}

                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">{item.start_date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">End Date</span>
                      <span className="font-medium">{item.end_time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBatch(item)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaEye className="w-4 h-4" />
                    <span className="font-medium">View Courses</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedBatch && (
        <ListOfCourses batch={selectedBatch} onClose={() => setSelectedBatch(null)}  />
      )}
    </>

  );
};

const ListOfCourses = ({ batch, onClose }:any) => {
 const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-7xl h-[95%] p-6 relative shadow-2xl flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
      >
        <RxCross2 className="w-6 h-6 text-gray-600" />
      </button>
  
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Courses in {batch?.name}
      </h3>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
        {batch?.courses?.map((course:any, index:number) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="font-medium text-gray-800">{course.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {course.description}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-blue-600">Duration: {course.duration}</span>
              <span className="px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                <MdOutlineArrowRightAlt 
                  size={30}  
                  // onClick={() => router.push("/student/learn/course", { state: { item: course } })} 
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default BatchCard;
