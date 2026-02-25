import React from 'react'
import HeaderForm from './HeaderForm'
import AboutThisCourse from './AboutThisCourse'
import RecommendedCourse from '../CoursDetailPage/RecommendedCourse'
import Skillgain from '../CoursDetailPage/Skillgain'
import AboutOurCourse from './AboutOurCourse'
import WhoShouldJoin from './WhoShouldJoin'
import ManageCertificates from '../CoursDetailPage/ManageCertificates'
import HiringPartners from './HiringPartners'
import Faq from '../Home/Faq'
import CourseFooter from './CourseFooter'
import { FaChevronRight, FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


function MainCourse({ specificCourse }: { specificCourse: any }) {
    // console.log("specificCourse", specificCourse.id)
    // const router = useRouter()
    return (
        <div className='space-y-10 '>
            <div className=" mt-5 mx-auto">
                <div className="  w-[85%] m-auto mb-2 ">
                    <ul className=" flex items-center gap-1 md:gap-3">
                        <Link
                        href={"/"}
                        >
                        <li>
                            <FaHouse
                                className="w-[14px] h-[14px] lg:w-[22px] lg:h-[22px] text-[#767777] cursor-pointer"
                            />
                        </li>
                        </Link>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <Link
                            href={{
                                pathname: "/courses",
                                search: "?query=free",
                            }}
                        >
                            <li className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                                Courses
                            </li>
                        </Link>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <Link
                            href={`/courses/${specificCourse.catname.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <li

                                className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                                {specificCourse?.catname}
                            </li>
                        </Link>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <li className="text-[10px] overflow-hidden text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                            {specificCourse?.title}
                        </li>
                    </ul>
                </div>
            </div>
            <HeaderForm id={specificCourse.id} type="course"  />
            <AboutThisCourse />
            <RecommendedCourse data={specificCourse?.recommended_courses} title="Our Popular" />
            <Skillgain courseSkills={specificCourse} />
            <AboutOurCourse />
            <WhoShouldJoin />
            <ManageCertificates />
            <HiringPartners />
            <Faq bgColor="bg-orange-100" pt="pt-5" />
            <CourseFooter />
        </div>
    )
}

export default MainCourse
