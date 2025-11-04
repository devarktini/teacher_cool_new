import CorporateCourses from '@/components/Corporates/CorporateCourses'
import Hero from '@/components/Corporates/Hero'
import OtherSection from '@/components/Corporates/OtherSection'
import React from 'react'


export const metadata = {
  title: "Corporate Training in Data Science and IT | TeacherCool LMS Solutions",
  description:
    "Collaborate with TeacherCool to deliver high-impact training in Data Science, Cybersecurity, and Cloud Computing. Ideal for corporates, universities, and institutions seeking scalable LMS and expert content.",
  keywords:
    "Corporate LMS India, University training partner Data Science education for institutions, TeacherCool B2B training, Cloud computing courses, Corporate training India, IT upskilling programs",
};

function page() {
    return (
        <>
            <Hero />
            <CorporateCourses />
            <OtherSection/>
        </>

    )
}

export default page
