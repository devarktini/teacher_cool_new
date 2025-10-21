import Courses from "@/components/Home/Courses/Courses";

// app/courses/page.tsx
export default function CoursesPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams.query;

  return (
    <>
      <Courses query = {query}/>
    </>
  );
}
