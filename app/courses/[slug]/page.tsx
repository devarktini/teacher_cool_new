import HomeApiService from "@/services/homeApi";
import CourseDetails from "@/components/CoursDetailPage.tsx/CourseDetails";
// import Courses from "@/components/Courses"; // ⬅️ Make sure this import path is correct
import { seoData } from "@/data/seoData";

interface PageProps {
  params: {
    slug: string;
  };
}
 const toSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-")
// ✅ Generate SEO dynamically
export async function generateMetadata({ params }: PageProps) {
  const { slug} = params;

  const normalizeSlug = (text: string) =>
    text
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/^-+|-+$/g, "");

  const seo = seoData.find((item) => {
    const seoSlug = normalizeSlug(item.courseName);
    const paramSlug = normalizeSlug(slug);
    return seoSlug === paramSlug;
  });
   const allCourseResponse = await HomeApiService.getCourseList();
  const allCourseList = allCourseResponse?.results || [];

  const matchedCourse:any = allCourseList.find(
    (item: any) => toSlug(item.title) === slug
  );

  // Fetch course to use as fallback
  const courseData = await HomeApiService.getCourseById(matchedCourse?.id);
  const course = courseData?.data;

  const seoTitle = seo?.seoTitle || course?.title || "Teacher Cool Course";
  const metaDescription =
    seo?.metaDescription || course?.description?.slice(0, 160) || "";
  const metaKeywords = seo?.metaKeywords;

  return {
    title: seoTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `https://admin.teachercool.com/courses/${slug}/`,
    },
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      url: `https://admin.teachercool.com/courses/${slug}/`,
      type: "website",
    },
  };
}

// ✅ The actual page component
export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = params;


  // // Helper: convert title → slug format
  // const toSlug = (text: string) =>
  //   text
  //     .toLowerCase()
  //     .replace(/[^a-z0-9\s-]/g, "") // remove special chars
  //     .trim()
  //     .replace(/\s+/g, "-")

  // Fetch all courses (API likely returns { data: [...] })
  const allCourseResponse = await HomeApiService.getCourseList();
  const allCourseList = allCourseResponse?.results || [];

  const matchedCourse:any = allCourseList.find(
    (item: any) => toSlug(item.title) === slug
  );

  // Handle not found case
  if (!matchedCourse) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Course not found.
      </div>
    );
  }

  // Fetch specific course details by ID
  const courseData = await HomeApiService.getCourseById(matchedCourse?.id);
  const course = courseData?.data;

  return (
    <div className="space-y-10">
      {/* Course Details Section */}
      <CourseDetails specificCourse={course} />
    </div>
  );
}


