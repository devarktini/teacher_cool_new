'use Client'
import React, { useState } from 'react'
import LearningOutcomes from './LearningOutcomes';
import Skillgain from './Skillgain';
import CourseBrief from './CourseBrief';
import LearningModules from './LearningModules';
import ManageCertificates from './ManageCertificates';
import TestimonialSlider from './TestimonialSlider';
import RecommendedCourse from './RecommendedCourse';
import Image from 'next/image';
import tick from '@/public/images/university/tick.png'

interface SelectedCourseDetailProps {
  specificCourse: any;
}
const SelectedCourseDetail: React.FC<SelectedCourseDetailProps> = ({ specificCourse }) => {
 const [activeIndex, setActiveIndex] = useState(0);
  const [activeCourse, setActiveCourse] = useState("About");

// console.log("dsa", specificCourse)

  const courses = [
    { name: specificCourse?.about?.length ? "About" : null },
    { name: specificCourse?.outcomes?.length ? "Learning Outcomes" : null },
    // { name: "Modules" },
    // { name: "Testimonials" },
    // { name: "Course Brief" },
    // { name: "Recommendations" },
  ];

//   useEffect(() => {
//       const id = localStorage.getItem("courseId");
//     getCourseById(id).then((res) => {
//       if (res) {
//         try {
//           setSpecificCourse(res?.data);
//           setCourseAbout(res?.data?.about);
//           setCourseSkills(res?.data?.skills?.split(","));
//         } catch (error) {
//           console.error("Error handling course data: ", error);
//         }
//       }
//     });
    // console.log("dkdk")
//   }, []);
  return (
    <>
      <div className="relative">
        <div className="flex xl:flex-wrap flex-row overflow-auto gap-4 md:gap-8 my-5">
          {courses
            .filter((course) => course?.name) // Filter out null values
            .map((course:any, index) => (
              <div key={index}>
                <p
                  className={`cursor-pointer font-medium whitespace-nowrap text-base font-Roboto px-2 py-1 mb-3 rounded-md ${
                    activeIndex === index
                      ? "text-blue-500 bg-[#F4F6FC] border-blue-500"
                      : "text-[#1E1E1E] text-opacity-85"
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    setActiveCourse(course?.name);
                  }}
                >
                  {course?.name}
                </p>
                <p
                  className={`${
                    activeIndex === index
                      ? "border-blue-500 border-b-4"
                      : "none"
                  }`}
                ></p>
              </div>
            ))}

          {specificCourse?.length > 0 && ( // Ensure specificCourse exists before checking length
            <hr
              style={{
                backgroundColor: "#e5e7e8",
                minWidth: "22%",
                height: "4px",
                position: "absolute",
                bottom: "0px",
                zIndex: "-1",
              }}
            />
          )}
        </div>
      </div>

      <div className="pb-5">
        {activeCourse === "About" && (
          <>
            {specificCourse?.about && specificCourse.about.length > 0 ? (
              <>
                <div className="pt-4 pb-6">
                  <p className="font-Roboto font-semibold text-lg capitalize">
                    What you'll learn
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 mb-8 gap-4">
                  {Array.isArray(specificCourse.about) ? (
                    specificCourse.about.map((item:any, index:number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 col-span-1 md:col-span-4"
                      >
                        <Image
                          src={tick}
                          alt="icon"
                          className="w-5 h-5"
                        />
                        <p className="font-Roboto text-sm text-[#1E1E1E] text-opacity-80">
                          {item}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="font-Roboto text-sm text-[#1E1E1E] text-opacity-80">
                      No data available
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </>
        )}
        {activeCourse == "Learning Outcomes" && (
          <LearningOutcomes courseOutcome={specificCourse} />
        )}

        {/* {activeCourse == "Modules" && (
            <LearningModules modules={specificCourse} />
          ) } */}

        {/* {activeCourse == "Testimonials" && <TestimonialSlider />} */}

        <Skillgain courseSkills={specificCourse} />
        <CourseBrief courseBrief={specificCourse} />
        <LearningModules
          modules={specificCourse}
          preview_files={specificCourse?.preview_files}
        />
        {specificCourse?.testimonials?.length > 0 && (
          <TestimonialSlider testimonialData={specificCourse.testimonials} />
        )}
        {/* <StudyMaterial /> */}
        {/* <Debugging /> */}
        <ManageCertificates />
        {/* <LearningLab /> */}
        <RecommendedCourse data={specificCourse?.recommended_courses} />
      </div>
    </>
  )
}

export default SelectedCourseDetail
