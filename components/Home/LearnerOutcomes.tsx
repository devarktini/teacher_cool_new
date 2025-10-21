import Image from 'next/image'
import React from 'react'
import img5 from "@/public/images/Ellipse5.png";
import collage from "@/public/images/COLLAG.png"

function LearnerOutcomes() {
  return (
     <>
      <div>
        <div className="bg-blue-200 relative w-full flex justify-center items-center">
          {/* Left Background Image */}
       
          {/* Container to keep content centered */}
          <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-4 md:px-8">


            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 py-12">
              {/* Images Section */}
              <div className="flex flex-row gap-4 lg:w-1/2 justify-center lg:justify-start">
                <Image src={collage} alt="loading" />
              </div>

              {/* Text Section */}
              <div className="lg:w-1/2 text-center lg:text-left px-4 lg:px-0">
                <h1 className="text-4xl max-sm:text-3xl font-semibold leading-tight text-gray-800">
                  Learners outcomes on TeacherCool
                </h1>
                <p className="text-base py-5 xl:text-left text-justify text-gray-500 leading-relaxed">
                  On TeacherCool, learners experience a transformative educational journey that equips them with practical, in-demand skills. Each course is designed with real-world applications in mind, helping students gain relevant knowledge that directly impacts their career growth. Learners benefit from personalized learning paths, allowing them to progress at their own pace, whether they are just starting out or advancing their skills.
                  <br />
                  Through interactive content and hands-on projects, students can actively apply what they learn, building confidence and proficiency. TeacherCool provides a collaborative environment where learners can connect with peers and instructors, fostering a sense of community and shared growth.
                </p>
                <div>
                  {/* {!localStorage.getItem("userAuth") && (
                    <JoinFreeBtn
                      title={"Join For Free"}
                      bgColor={"bg-[#0966ED]"}
                      color={"text-white"}
                      className="px-4 py-3 text-lg"
                    />
                   
                  )} */}
                   <button className='bg-[#0966ED] text-white px-2 py-1 rounded-sm '>Join For Free</button>
                </div>
              </div>
            </div>

            {/* Right Background Image */}
          </div>
          <Image
            src={img5}
            alt="ellipse"
            className=" hidden md:block absolute right-0 bottom-0 w-1/3 max-w-[7.5rem] h-auto"
          />
        </div>
      </div>


    </>
  )
}

export default LearnerOutcomes
