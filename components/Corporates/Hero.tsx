'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import img1 from '@/public/images/corporates/img1.jpg';
import img4 from '@/public/images/corporates/img4.jpg';
import img3 from '@/public/images/corporates/img3.jpg';
import tickIcon from '@/public/images/university/tick.png'
import pexels from '@/public/images/corporates/pexels.png'
function Hero() {
    const sliderImages = [img1, img4, img3];
    const [index, setIndex] = useState(0);

    // Auto-play logic
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % sliderImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);


    return (
        <>
        
        <div className="flex bg-[#F5F5F5] py-10 items-center justify-center px-4">
            <div className="flex w-full lg:w-[95%] md:flex-row justify-center flex-col-reverse gap-8 items-center lg:items-start">
                {/* Content Section */}
                <div className="flex-1 flex flex-col gap-4 lg:px-6 tracking-wide lg:w-[30%]">
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-800">
                        Unlock Your Team's Potential to Propel Business Success
                    </h1>
                    <p className="text-gray-600 text-[5px] md:text-base">
                        In today’s fast-paced business environment, continuous learning and skill development are critical to staying competitive. Teachercool LMS empowers organizations to unlock their team’s potential, driving business growth and long-term success.
                    </p>

                    {/* Features List */}
                    <div className="flex flex-col text-sm">
                        {[
                            "Customized Training Pathways for Skill Development",
                            "On-Demand Learning for Flexibility & Convenience",
                            "Real-World Simulations and Scenario-Based Training",
                            "Performance Tracking & Analytics",
                            "Skill Certification & Recognition",
                            "Collaboration & Knowledge Sharing",
                            "Integration with Existing Tools",
                            "Soft Skills Development for Enhanced Performance",
                            "Leadership & Talent Development Programs",
                            "Compliance Training Made Easy",
                            "Dedicated Support for Seamless Implementation",
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 tracking-wider">
                                <Image src={tickIcon} alt="Tick" className="w-4 h-4" />
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Call-to-Action */}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link
                            href="/contact"
                            className="px-5 py-2 bg-[#0966ED] text-white no-underline text-sm rounded-sm w-max hover:bg-[#064bbf]"
                        >
                            Contact us
                        </Link>

                    </div>
                </div>

                {/* Image Slider Section */}
                <div className="flex-1 w-[60%] lg:w-[40%]"> {/* Adjusted width for larger images */}
                    <Image
                        src={sliderImages[index]}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[400px] md:h-[500px] object-cover rounded-md"
                        priority
                    />
                    {/* {sliderImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-3 h-3 rounded-full transition-all ${i === index ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        />
                    ))} */}
                </div>
            </div>
        </div>

        <div className="flex items-center justify-center mt-10">
        <div className="flex w-full lg:w-[95%] flex-col md:flex-row gap-4 lg:gap-0">
          {/* Image Section */}
          <div className="flex-1">
            <Image
              src={pexels}
              className='w-[100%] rounded-md'
              alt="Teacher Cool Program"
            />
          </div>

          {/* Text Section */}
          <div className="flex-1 flex items-center md:pl-6">
            <p className='md:text-4xl text-3xl font-semibold text-center md:text-left'>
              Leaders at 3,800+ companies <br className='md:hidden' /> develop their talent with Teacher Cool
            </p>
          </div>
        </div>
      </div>
      </>
    )
}

export default Hero
