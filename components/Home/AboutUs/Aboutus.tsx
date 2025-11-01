import React from 'react'
import Link from 'next/link'
import AboutLeft from './AboutLeft'
import AboutRight from './AboutRight'

function Aboutus() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 text-sm font-semibold">
            About Us
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Empowering Educators & Learners with Better Tools
          </h2>
          <p className="mt-3 text-gray-600 text-base sm:text-lg">
            We design modern, research-backed programs and intuitive tools to help teachers and institutions deliver measurable learning outcomes.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/for-individual"
              className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium shadow"
            >
              Explore Programs
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 text-sm"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col justify-center">
              <AboutLeft />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-gradient-to-r from-white via-indigo-50 to-white rounded-2xl shadow-md p-6 h-full">
              <AboutRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutus
