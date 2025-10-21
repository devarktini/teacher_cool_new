import Courses from "@/components/Home/Courses/Courses";
import Faq from "@/components/Home/Faq";

// app/courses/page.tsx
export default function CoursesPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query;

  return (
    <>
      <Courses query = {query}/>
      <Faq bgColor="bg-white" pt="pt-5" />
    </>
  );
}
