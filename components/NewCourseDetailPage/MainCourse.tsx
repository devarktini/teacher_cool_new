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


function MainCourse({ specificCourse }: { specificCourse: any }) {
    // console.log("specificCourse", specificCourse)
    return (
        <div className='space-y-10 '>
            <HeaderForm />
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
