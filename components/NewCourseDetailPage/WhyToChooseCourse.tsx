"use client";
import HomeApiService from "@/services/homeApi";
import React, { useEffect, useState } from "react";

interface WhyToChooseCourseProps {
  id: any;
  type: "course" | "category";
}

interface WhyToChooseCourseData {
  id?: string;
  title?: string;
  description?: string;
  points?: string[];
}

function WhyToChooseCourse({ id, type }: WhyToChooseCourseProps) {
  const [data, setData] = useState<WhyToChooseCourseData>({});

  const fetchDetails = async () => {
    try {
      const response: any = await HomeApiService.getSeoCourseByEntity(
        "why-choose-course",
        type === "course"
          ? { course_id: id }
          : { category_id: id }
      );

      setData(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id, type]);

  if (!data?.title) return null;

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 uppercase">
          {data.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-sm md:text-base">
          {data.description}
        </p>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Points Section */}
          {data.points && data.points.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {data.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-600">✔</span>
                  <p className="text-gray-700 text-sm">{point}</p>
                </div>
              ))}
            </div>
          )}

          {/* Video / Image Section */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <img
                src="/images/sample-video-thumbnail.jpg"
                alt="Course Preview"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 mb-4">
            Want To Know More? Download Our Brochure And Complete Course Information
          </p>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-md shadow-md transition">
            ⬇ DOWNLOAD SYLLABUS
          </button>
        </div>

      </div>
    </div>
  );
}

export default WhyToChooseCourse;