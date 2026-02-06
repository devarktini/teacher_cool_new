"use client";
import React, { useState } from "react";

const courseData = [
  {
    id: 1,
    title: "Digital Marketing Overview",
    description:
      "Learn the fundamentals of digital marketing including SEO, SEM, and social media strategies.",
  },
  {
    id: 2,
    title: "Search Engine Optimization (SEO)",
    description:
      "Master on-page, off-page SEO, keyword research, and ranking techniques.",
  },
  {
    id: 3,
    title: "Social Media Marketing",
    description:
      "Create high-converting social media campaigns across Facebook, Instagram, and LinkedIn.",
  },
  {
    id: 4,
    title: "Google Ads & PPC",
    description:
      "Run profitable Google Ads campaigns with proper targeting and bidding strategies.",
  },
  {
    id: 5,
    title: "Content Marketing",
    description:
      "Learn content planning, blogging, copywriting, and content promotion techniques.",
  },
  {
    id: 6,
    title: "Email Marketing",
    description:
      "Build email funnels, automation, and conversion-driven email campaigns.",
  },
  {
    id: 7,
    title: "Affiliate Marketing",
    description:
      "Understand affiliate networks, tracking, and monetization strategies.",
  },
  {
    id: 8,
    title: "Analytics & Tracking",
    description:
      "Use Google Analytics and Tag Manager to track and optimize campaigns.",
  },
];

function AboutOurCourse() {
  const [activeCourse, setActiveCourse] = useState(courseData[0]);

  return (
    <section className="max-w-8xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        About Our Course
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT SIDE - COURSE TITLES */}
        <div className="md:col-span-1 border rounded-lg p-4">
          <ul
            className="space-y-2 max-h-[360px] overflow-y-auto pr-2"
          >
            {courseData.map((course) => (
              <li
                key={course.id}
                onClick={() => setActiveCourse(course)}
                className={`cursor-pointer p-3 rounded-md transition
                  ${
                    activeCourse.id === course.id
                      ? "bg-yellow-400 text-black font-semibold"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE - COURSE DETAILS */}
        <div className="md:col-span-2 border rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            {activeCourse.title}
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {activeCourse.description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutOurCourse;
