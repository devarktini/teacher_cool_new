import Link from 'next/link'
import Carousel from '@/components/Carousel'
import ExploreCourses from '@/components/Home/ExploreCourses'
import PopularTopics from '@/components/Home/PopularTopics'
import WhyChooseCourse from '@/components/Home/WhyChooseCourse'
import Aboutus from '@/components/Home/AboutUs/Aboutus'
import LearnerOutcomes from '@/components/Home/LearnerOutcomes'
import Faq from '@/components/Home/Faq'
import TeachercoolCourses from '@/components/Home/TeachercoolCourses'
import CourseToday from '@/components/Home/CourseToday'
import NewOnTeachercool from '@/components/Home/NewOnTeachercool'
import StartCourseToday from '@/components/Home/StartCourseToday'
import Campaigns from '@/components/Home/Campaigns/Campaigns'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col "> {/* Add padding-top equal to navbar height */}
      <Carousel />
      <ExploreCourses />
      <PopularTopics/>
      <StartCourseToday/>
      <Campaigns/>
      <NewOnTeachercool/>
      <WhyChooseCourse/>
      <Aboutus/>
      <LearnerOutcomes/>
      <CourseToday/>
      <TeachercoolCourses/>
      <Faq bgColor="bg-orange-100" pt="pt-5" />
      
    </main>
  )
}
