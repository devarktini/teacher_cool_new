"use client";
import React from "react";

const partners = [
  { name: "Google", logo: "https://logo.clearbit.com/google.com" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
  { name: "Flipkart", logo: "https://logo.clearbit.com/flipkart.com" },
  { name: "Infosys", logo: "https://logo.clearbit.com/infosys.com" },
  { name: "Wipro", logo: "https://logo.clearbit.com/wipro.com" },
  { name: "TCS", logo: "https://logo.clearbit.com/tcs.com" },
];

function HiringPartners() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      
      {/* HEADING */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Our <span className="text-yellow-400">Hiring Partners</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Top companies where our students are working today
        </p>
      </div>

      {/* LOGOS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {partners.map((company, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl p-6 flex flex-col items-center justify-center
                       shadow-sm hover:shadow-lg transition duration-300"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="h-12 object-contain mb-3 grayscale hover:grayscale-0 transition"
            />
            <p className="text-sm font-medium text-gray-700">
              {company.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HiringPartners;
