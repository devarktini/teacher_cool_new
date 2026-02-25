import Courses from "@/components/Home/Courses/Courses";
import Faq from "@/components/Home/Faq";

export default function CoursesPage({ searchParams }: { searchParams: { topic?: string; query?: string } }) {
  // Support both ?query= and ?topic=
  const query = searchParams.topic || searchParams.query || "";

  if (query) return (
    <>
      <Courses query={query} />
      <Faq bgColor="bg-white" pt="pt-5" />
    </>
  );

  return (
    <Courses />
  )

}

