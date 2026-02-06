"use client";
import React from "react";

const audienceData = [
  {
    title: "Career Transitioners",
    image: "/images/career.jpg",
  },
  {
    title: "Working Professionals",
    image: "/images/working.jpg",
  },
  {
    title: "Freshers",
    image: "/images/freshers.jpg",
  },
  {
    title: "Undergrads",
    image: "/images/undergrads.jpg",
  },
  {
    title: "Tech Graduates",
    image: "/images/tech.jpg",
  },
];

function WhoShouldJoin() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT TITLE */}
        <div>
          <h2 className="text-4xl font-bold leading-snug">
            Who Should Join <br />
            Our Digital <br />
            Marketing Course?
          </h2>
        </div>

        {/* RIGHT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {audienceData.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-28 object-cover rounded-lg mb-3"
              />
              <p className="text-sm font-semibold text-gray-700">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DESCRIPTION CONTENT */}
      <div className="mt-12 space-y-6 text-gray-600 leading-relaxed text-sm">
        <p>
          You can join this digital marketing course online if you're ready to
          transform your career and achieve your dreams. If you're a student or
          fresher, you can start a high-paying career where creativity and
          technology come together. If you're already working, you can add
          advanced digital marketing skills to your profile and stand out.
        </p>

        <p>
          Entrepreneurs and business owners can learn how to grow their own
          brand, bring in more leads, and connect with their customers in new
          ways. Digital marketing is not just a skill; it's your chance to build
          a future where you're in control.
        </p>

        <p>
          The world is going digital, and there's a massive demand for people
          who know how to make brands shine online. Roles like SEO expert,
          social media manager, content creator, and performance marketer are
          waiting for you, with top companies offering exciting packages.
        </p>

        <p>
          This advanced digital marketing course also gives you the freedom to
          work from home, explore remote jobs, or become a freelancer. Some of
          our learners even start their own businesses, using digital marketing
          to drive growth and make their vision real.
        </p>

        <p>
          This online digital marketing course with certificate is for you if
          you're ready to take charge of your future and turn your goals into
          reality.
        </p>
      </div>
    </section>
  );
}

export default WhoShouldJoin;



