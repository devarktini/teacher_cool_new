import Link from 'next/link'
import React from 'react'

function Demand() {
  return (
       <>
      <section className="bg-gradient-to-r from-green-400 to-blue-500 p-8 lg:p-16 rounded-lg shadow-lg md:flex md:flex-row-reverse md:items-center md:justify-between">
        {/* Text Content */}
        <div className="lg:w-1/2 md:w-[100%] mb-8 lg:mb-0 md:order-2 ">
          <h1 className="text-3xl  lg:text-6xl font-bold text-white mb-4 ">
          World Class: Elevating Skills, Empowering Organizations
          </h1>
          <p className="text-white pb-10">
          At TeacherCool, we are redefining excellence in training and development with world-class programs designed to elevate skills and transform organizations. Our goal is to empower individuals and teams to achieve peak performance, driving innovation and success in every endeavour.
          </p>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-gray-900 py-2 px-6 rounded hover:bg-gray-300 transition duration-300">
              Contact us
            </button>
            <Link href="#" className="text-white underline hover:text-gray-300 transition duration-300">
              compare plans ↗
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center md:order-1">
          <img
            src="https://thumbs.dreamstime.com/b/soft-focus-to-face-student-sitting-waving-hand-home-looking-camera-joy-happy-face-lady-glad-to-see-friend-185028725.jpg" // Replace this with your image link
            alt="Smiling student"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>
      <div className="relative md:top-[-50px] lg:top-[-110px] xl:top-[-130px] sm:top-[170px] w-full md:w-full lg:w-full md:mx-auto lg:px-12">
        <section className="bg-black text-white p-4 lg:p-8 h-auto md:h-48 sm:h-48 rounded-lg shadow-lg sm:shadow-none lg:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-center items-center  space-y-3 md:space-y-0 md:space-x-8  sm:space-x-2">
            {/* Stat 1 */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/3 border-r border-gray-700 lg:last:border-none md:w-1/2 sm:w-full md:px-4 sm:px-2">
              <div>
                <h2 className="text-4xl font-bold mb-2">76%</h2>
                <p className="text-gray-300 text-center md:text-left">
                  The likelihood of students enrolling in a degree program that delivers industry micro-credentials is 76% higher
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/3 border-r border-gray-700 lg:last:border-none md:w-1/2 sm:w-full md:px-6 sm:px-2">
              <div>
                <h2 className="text-4xl font-bold mb-2">86%</h2>
                <p className="text-gray-300 text-center md:text-left">
                  The majority of students concur that earning a professional certificate will help them advance in their careers
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/3 md:w-1/2 sm:w-full md:px-6 sm:px-2">
              <div>
                <h2 className="text-4xl font-bold mb-2">72%</h2>
                <p className="text-gray-300 text-center md:text-left">
                  A candidate with a Professional Certificate has an average 72% higher chance of being hired by an employer
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Demand
