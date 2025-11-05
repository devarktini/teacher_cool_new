import HomeApiService from "@/services/homeApi";
import CourseDetails from "@/components/CoursDetailPage.tsx/CourseDetails";
// import Courses from "@/components/Courses"; // ⬅️ Make sure this import path is correct
import { seoData } from "@/data/seoData";

interface PageProps {
  params: {
    slug: string;
    id: string;
  };
}

// ✅ Generate SEO dynamically
export async function generateMetadata({ params }: PageProps) {
  const { slug, id } = params;

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

  // Fetch course to use as fallback
  const courseData = await HomeApiService.getCourseById(id);
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
      canonical: `https://teachercool.com/courses/${slug}/${id}`,
    },
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      url: `https://teachercool.com/courses/${slug}/${id}`,
      type: "website",
    },
  };
}

// ✅ The actual page component
export default async function CourseDetailPage({ params }: PageProps) {
  const { id ,slug} = params;
  const courseData = await HomeApiService.getCourseById(id);
  const course = courseData?.data;

  return (
    <div className="space-y-10">
      {/* Course Details Section */}
      <CourseDetails specificCourse={course} />
    </div>
  );
}
