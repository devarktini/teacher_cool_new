'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import img89 from '@/public/images/Frame89.png'
import img90 from '@/public/images/Frame90.png'

function WhyChooseCourse() {
      const [courseCount, setCourseCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [appUserCount, setAppUserCount] = useState(0);
  const [happyStudentCount, setHappyStudentCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has run

  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startAnimation(setCourseCount, 231);
          startAnimation(setInstructorCount, 89);
          startAnimation(setAppUserCount, 12000);
          startAnimation(setHappyStudentCount, 72000);
          setHasAnimated(true); // Mark animation as run
        }
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  const startAnimation = (setCount:any, endValue:any) => {
    let start = 0;
    const duration = 2000; // Duration of the animation in milliseconds
    const stepTime = 10; // Time between each increment in milliseconds
    const steps = duration / stepTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newCount = Math.min(
        start + (endValue - start) * (currentStep / steps),
        endValue
      );
      setCount(Math.floor(newCount));
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  };
    return (
        <div className="container mx-auto mb-2 lg:px-[7.25rem] px-5 md:px-8 mt-4 flex justify-between lg:flex-row sm:flex-col gap-4 max-sm:flex-col">
            <div className="container" ref={ref}>
                <h1 className="text-6xl max-sm:text-4xl font-bold py-3 leading-[60px] pb-4 space-x-1 ">
                    Why Choose Our Courses
                </h1>
                <p className="text-base xl:text-left text-justify pb-4 text-[#696969]">
                    Choosing our courses means investing in a learning experience tailored
                    to your success. Each course is designed by industry experts, ensuring
                    that you gain practical, real-world knowledge. With a focus on
                    up-to-date content, you’ll always be learning the latest trends and
                    techniques, preparing you to stay ahead in a competitive market.
                    <br />
                    Our flexible learning paths allow you to progress at your own pace,
                    whether you're a beginner or advancing your skills. With personalized
                    feedback, interactive sessions, and a wealth of resources, our courses
                    are designed to help you grow both professionally and personally.
                    <br />
                    You’ll also benefit from a diverse community of learners, providing
                    you with opportunities to network and collaborate with others. Whether
                    you’re looking to upskill, reskill, or simply explore a new field, our
                    courses offer the support, flexibility, and expertise you need to
                    succeed.
                </p>
                <div className="py-4 flex justify-between">
                    <span className="w-fit flex items-center justify-center flex-col">
                        <h3 className="text-3xl text-gray-700 font-semibold">{`${courseCount}+`}</h3>
                        <p className="text-gray-500 text-sm font-medium">
                            Courses & Subjects
                        </p>
                    </span>
                    <span className="w-fit flex items-center justify-center flex-col">
                        <h3 className="text-3xl text-gray-700 font-semibold">{`${instructorCount}+`}</h3>
                        <p className="text-gray-500 text-sm font-medium">Instructors</p>
                    </span>
                    <span className="w-fit flex items-center justify-center flex-col">
                        <h3 className="text-3xl text-gray-700 font-semibold">{`${(
                            appUserCount / 1000
                        ).toFixed(1)}k`}</h3>
                        <p className="text-gray-500 text-sm font-medium">Using the App</p>
                    </span>
                </div>

                <div className="flex items-center justify-start flex-row py-4">
                    <div className="flex items-center relative">
                        <Image
                            src={img89}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full z-0 "
                        />
                        <Image
                            src={img90}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full z-1 absolute left-6 border-2 border-white"
                        />
                        <Image
                            src={img89}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full z-2 absolute left-12 border-2 border-white"
                        />
                        <Image
                            src={img90}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full z-3 absolute left-20 border-2 border-white"
                        />
                        <Image
                            src={img89}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full z-4 absolute left-28 border-2 border-white"
                        />
                    </div>
                    <div className="ms-32 flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{`${(
                            happyStudentCount / 1000
                        ).toFixed(1)}k+`}</h3>
                        <p className="text-gray-500 text-sm">Happy Student</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="flex items-center w-[100%] m-0 justify-between pb-4">
                    <Image
                        src={img90}
                        alt=""
                        className="w-[50%]"
                    />
                    <div className="bg-white shadow-md text-center rounded-lg border-2 p-4 border-gray-200 h-[150px] sm:me-24">
                        <h1 className="text-blue-500 text-4xl font-extrabold">95%</h1>
                        <h3 className="font-semibold">Satisfaction Rate</h3>
                        <p className="text-gray-400 text-[10px]">
                            It is a long established fact that our learners are highly
                            satisfied with the quality of our courses and instruction.
                        </p>
                    </div>
                </div>

                <div className="flex items-center xl:flex-row flex-col w-[100%] m-0 justify-between py-4">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden w-[40%] max-sm:w-[100%] border-2 border-gray-100 sm:ms-12 max-sm:ms-0">
                        <div className="flex max-sm:flex-col w-[100%] items-center relative justify-between p-4">
                            <div className="flex relative max-sm:mr-10">
                                <Image
                                    src={img89}
                                    alt="Instructor 1"
                                    className="h-[50px] w-[50px] rounded-full z-0"
                                />
                                <Image
                                    src={img90}
                                    alt="Instructor 2"
                                    className="h-[50px] w-[50px] rounded-full z-1 absolute left-10 border-2 border-white"
                                />
                                <Image
                                    src={img89}
                                    alt="Instructor 3"
                                    className="h-[50px] w-[50px] rounded-full z-2 absolute left-16 border-2 border-white"
                                />
                            </div>
                            <h3 className="me-4 max-sm:me-0 text-md sm:w-[35%] max-sm:w-[100%] text-blue-600 font-semibold">
                                1.5k+ Instructors
                            </h3>
                        </div>

                        <div className="flex items-center justify-center flex-wrap px-4 py-2">
                            <h4 className="text-medium text-gray-600 font-semibold mr-2">
                                Expert Instructors
                            </h4>
                            <p className="text-sm sm:px-4 max-sm:px-2 text-gray-500">
                                With a diverse background and extensive experience, our
                                instructors are dedicated to providing high-quality education
                                and mentorship to every learner.
                            </p>
                        </div>
                    </div>

                    <Image
                        src={img89}
                        alt="no image"
                        className="xl:w-[50%] w-full "
                    />
                </div>
            </div>
        </div>
    )
}

export default WhyChooseCourse
