import Link from "next/link";
import React from "react";

function CityCourses({ courseSlug }: any) {
  const cities = [
    {
      title: "Study Consultants in New Delhi",
      link: `/${courseSlug}-course-in-new-delhi-ct`,
    },
    {
      title: "Study Consultants in Noida",
      link: `/${courseSlug}-course-in-course-in-noida-ct`,
    },
    {
      title: "Study Consultants in Lucknow",
      link: `/${courseSlug}-course-in-lucknow-ct`,
    },
    {
      title: "Study Consultants in Kolkata",
      link: `/${courseSlug}-course-in-kolkata-ct`,
    },
    {
      title: "Study Consultants in Gurugram",
      link: `/${courseSlug}-course-in-gurugram-ct`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      {/* Heading */}
      <h1 className="text-blue-500 text-2xl text-center font-bold mb-6">
        Find Expert Consultants in Your City
      </h1>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {cities.map((item: any, index: number) => (
          <Link
            key={index}
            href={item.link}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 text-sm font-medium"
          >
            {item.title}
          </Link>
        ))}
      </div>

    </div>
  );
}

export default CityCourses;