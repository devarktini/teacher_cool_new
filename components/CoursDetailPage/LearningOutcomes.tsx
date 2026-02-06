'use client'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from "react-icons/fa";
import tick from '@/public/images/university/tick.png'
import Image from 'next/image';

function LearningOutcomes({courseOutcome}:any) {
     const [courseOutcomes, setCourseOutcomes] = useState([]);

  useEffect(() => {
    // Transform data for consistent structure
    if (Array.isArray(courseOutcome.outcomes)) {
      const transformedOutcomes = courseOutcome.outcomes.map((item:any, index:number) => ({
        description: item,
        details: [],
      }));
      setCourseOutcomes(transformedOutcomes);
    }
  }, [courseOutcome.outcomes]);
  return (
     <>
      {courseOutcomes.length > 0 && (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Learning Outcomes
          </h2>
          <h2 className="text-2xl font-semibold my-4 border-b border-gray-300">
            Course Outcomes
          </h2>
          <ul className="space-y-8 mt-4">
            {courseOutcomes.map((outcome:any, index:number) => (
              <li key={index} className="flex">
                <div className="pt-1 w-10">
                  {/* <FaCheckCircle className="text-green-500 w-6 h-6 text-3xl mr-4" /> */}
                  <Image src = {tick} alt='loading...'/>
                </div>
                <div>
                  <h3 className="text-xl font-semibold  text-gray-800 mb-2">
                    {outcome.description.split(":")[0]}{" "}
                    {outcome.description.split(":")[1] ? ":" : ""}{" "}
                    <p className=" text-sm font-normal">
                      {outcome.description.split(":")[1]}
                    </p>
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default LearningOutcomes
