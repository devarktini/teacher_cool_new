'use client'
import React from 'react'
import certificate from '@/public/images/certificate_template.jpg'
import Image from 'next/image'
function ManageCertificates() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 my-16 px-4">
        {/* Certificate Image */}
        <div className="md:col-span-3 col-span-1 flex justify-center items-center">
          <Image
            src={certificate}
            alt="certificate"
            className="w-full max-w-[500px] h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Text Content */}
        <div className="md:col-span-2 col-span-1 flex flex-col justify-center space-y-4">
          {/* <h1 className="font-serif font-medium text-2xl md:text-3xl text-[#1E1E1E]">
            Earn a career certificate
          </h1>
          <p className="font-serif text-base text-[#1E1E1E] text-opacity-70 leading-relaxe1d text-justify">
            Unlock your career potential with a certificate. Add this credential
            to your professional profiles, update your resume or CV, and share
            your success with your network on social media and in performance
            evaluations.
          </p> */}
          <article className="prose">
            <h1 className='text-3xl font-bold py-2'>Earn a career certificate</h1>
            <p className="text-justify">
              Unlock your career potential with a certificate. Add this credential
              to your professional profiles, update your resume or CV, and share
              your success with your network on social media and in performance
              evaluations.
            </p>
          </article>
          {/* <button className="font-serif font-medium text-base text-white bg-[#0966ED] hover:bg-[#074fba] w-48 h-12 rounded-md">
            APPLY NOW
          </button> */}
        </div>
      </div>
    </>
  )
}

export default ManageCertificates
