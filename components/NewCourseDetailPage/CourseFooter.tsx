"use client";
import React from "react";

const sections = [
  {
    title: "Popular Courses",
    links: [
      "Digital Marketing Course",
      "Data Analytics Course",
      "Full Stack Web Development Course",
      "Performance Marketing Course",
      "SEO Course",
      "Ethical Hacking Course",
      "App Development Course",
    ],
  },
  {
    title: "Free Courses",
    links: [
      "Semrush Course",
      "Google Tag Manager Course",
      "Blogging Course",
      "Photoshop Course",
      "Video Editing Course",
      "AngularJS Course",
      "Shopify Course",
      "Django Course",
      "Email Marketing Course",
      "Affiliate Marketing Course",
    ],
  },
  {
    title: "Free Tutorials & Programs",
    links: [
      "DSA Tutorial",
      "Python Tutorial",
      "JavaScript Tutorial",
      "C Tutorial",
      "C++ Tutorial",
      "HTML Tutorial",
      "Java Tutorial",
      "SQL Tutorial",
      "Python Programs",
      "Java Programs",
      "JavaScript Programs",
      "C Programs",
      "C++ Programs",
    ],
  },
  {
    title: "Online Compilers",
    links: [
      "Python Compiler",
      "Java Compiler",
      "JavaScript Compiler",
      "HTML Editor",
      "C Compiler",
      "C++ Compiler",
      "SQL Compiler",
    ],
  },
];

function CourseFooter() {
  return (
    <section className="bg-gradient-to-b from-[#071a52] to-[#04297a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {sections.map((section, index) => (
          <div key={index}>
            {/* SECTION TITLE */}
            <h3 className="text-sm font-semibold mb-3">
              {section.title}
            </h3>

            {/* LINKS */}
            <div className="flex flex-wrap gap-x-2 gap-y-2 text-xs text-gray-200 leading-relaxed">
              {section.links.map((link, i) => (
                <span key={i} className="hover:text-yellow-400 cursor-pointer">
                  {link}
                  {i !== section.links.length - 1 && (
                    <span className="mx-2 text-gray-400">|</span>
                  )}
                </span>
              ))}
            </div>

            {/* DIVIDER */}
            {index !== sections.length - 1 && (
              <hr className="border-white/20 mt-6" />
            )}
          </div>
        ))}

      </div>
    </section>
  );
}




export default CourseFooter
