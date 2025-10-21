// app/courses/[slug]/[id]/page.tsx
import HomeApiService from "@/services/homeApi";
import CourseDetails from "@/components/CoursDetailPage.tsx/CourseDetails";
interface PageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug, id } = params;

  const courseData = await HomeApiService.getCourseById(id)
  // console.log("cc",courseData)
 
  return (
    <div>
    <CourseDetails specificCourse={courseData?.data}/>
    </div>
  );
}
