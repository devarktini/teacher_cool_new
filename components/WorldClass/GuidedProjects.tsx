import Link from 'next/link'
import React from 'react'

function GuidedProjects() {
  return (
       <>
      {/* Text Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-6xl mx-auto p-6 md:p-12 space-y-8 md:space-y-0 bg-white rounded-lg shadow-md">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h3 className="text-blue-600 font-semibold mb-2">GUIDED PROJECTS</h3>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Give pupils the opportunity to acquire critical practical skills
          </h1>
          <p className="text-gray-700 mb-6">
            Use the newest tools and technology in the business to deliver practical courses.
          </p>
          <ul className="space-y-3 text-left pr-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Give pupils the tools they need with task-based learning and detailed instructions.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Equip pupils to handle and resolve problems that arise in the workplace.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Provide remote workspaces with standard office supplies; no installation or downloads are needed.
            </li>
          </ul>
          <Link href="#" className="inline-block mt-6 text-blue-600 font-semibold hover:underline">Learn more →</Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://images.ctfassets.net/2pudprfttvy6/6GkGMGaxHYprzVanlGgOsl/a0d1b878457892bee1adaee5c4109cfc/GuidedProjects_1-5x.png"
            alt="Guided Projects"
            className="w-full h-auto max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Career Discovery Section */}
      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto p-6 lg:p-12 space-y-8 md:space-y-0 bg-gray-50 rounded-lg shadow-md lg:mt-8 gap-8">
        {/* Image Section */}
        <div className="lg:w-1/2 w-full  mb-8 md:mb-0">
          <img 
            src="https://images.ctfassets.net/2pudprfttvy6/2aKysci21yk4uwVkmU2QrA/213ee9b4ca88d544c0bce252e16cd14e/c4c-image-ca-career-discovery.jpg" 
            alt="Career Discovery" 
            className="rounded-lg w-full h-auto object-cover shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 w-full text-center md:text-left">
          <h3 className="text-gray-600 font-semibold mb-2">CAREER DISCOVERY</h3>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            Assist students in investigating career paths and entry-level positions.
          </h1>
          <p className="text-gray-700 mb-6">
            Give information about a variety of industries.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Emphasize positions in industries with rapid growth
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Encourage knowledge and comprehension of entry-level opportunities
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✔</span> Determine typical job titles, necessary skills, geographical pay ranges, and available positions.
            </li>
          </ul>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto p-6 md:p-12 bg-white rounded-lg shadow-lg mt-8">
        {/* Image Section */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-8">
          <img 
            src="https://images.ctfassets.net/2pudprfttvy6/7nDzqhW9pQhfONQ1d3l2nj/65ddb50fd2e157d74de946000d570fe9/mark-r2.jpg" 
            alt="Testimonial" 
            className="rounded-full w-full h-auto object-cover md:w-40 md:h-40 border-4 border-gray-200 shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left md:flex-1">
          <div className="relative mb-4">
            {/* <span className="text-6xl text-gray-300 absolute -left-6 -top-4 hidden md:block">“</span> */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6 md:pr-8">
              Through in-demand skills training and certificates from leading companies like Google and IBM, TeacherCool's Career Academy is assisting Hawaii Pacific University in fulfilling its mission to provide students with a practical, innovative, and experiential education. These resources complement our classroom curriculum and provide students with pathways to meaningful employment opportunities. In my capacity as dean, I can guarantee that members of the Career Academy are learning skills that they want and that are relevant to open positions. The reaction from students has been overwhelmingly favorable.
            </p>
            {/* <span className="text-6xl text-gray-300 absolute -right-6 -top-4 hidden md:block">”</span> */}
          </div>
          
          {/* Author Section */}
          <div className="mt-4">
            <h4 className="text-xl font-semibold text-gray-900">Mark S. R.</h4>
            <p className="text-gray-600">Ph.D., Dean, College of Business at Hawaii Pacific University</p>
            <img 
              src="https://images.ctfassets.net/2pudprfttvy6/4kI8p4DahzG4gXIAL6nK0J/1e5a4750cdf66c308c48b8d5afe798cb/hawaii-pacific-university-vector-logo.svg" 
              alt="University Logo" 
              className="h-8 mt-2 inline-block"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default GuidedProjects
