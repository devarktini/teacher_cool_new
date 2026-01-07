// app/courses/[slug]/page.tsx
import HomeApiService from "@/services/homeApi";
import CourseDetails from "@/components/CoursDetailPage.tsx/CourseDetails";
import { seoData } from "@/data/seoData";
import axios from "axios";

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Robust slugify: lowercases, replaces & and other separators with whitespace,
 * removes non-alphanumeric (except hyphen), collapses whitespace/hyphens to single hyphen,
 * trims leading/trailing hyphens.
 */
const slugify = (input?: string) => {
  if (!input) return "";
  return input
    .toString()
    .toLowerCase()
    // convert ampersands and common separators to space first
    .replace(/&/g, " and ")
    .replace(/[_+]/g, " ")
    // remove characters that are not letters, numbers, spaces or hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // collapse whitespace to single space
    .replace(/\s+/g, " ")
    .trim()
    // convert spaces to hyphen
    .replace(/\s+/g, "-")
    // collapse multiple hyphens (if any)
    .replace(/-+/g, "-")
    // trim leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
};

// Use the same helper for seo lookup
const normalizeSlug = slugify;

// Generate metadata and page remain largely the same (only matching changed)
export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;

  try {
    const seo = seoData.find((item) => {
      const seoSlug = normalizeSlug(item.courseName);
      const paramSlug = normalizeSlug(slug);
      return seoSlug === paramSlug;
    });

    let course = null;

    try {
      const allCourseResponse = await HomeApiService.getCourseList();
      const allCourseList = allCourseResponse?.results || [];

      const matchedCourse: any = allCourseList.find((item: any) => {
        // if API supplies a slug field, prefer that
        if (item?.slug && slugify(item.slug) === slug) return true;
        return slugify(item?.title) === slug;
      });

      if (matchedCourse?.id) {
        const courseData = await HomeApiService.getCourseById(matchedCourse.id);
        course = courseData?.data;
      }
    } catch (apiError) {
      console.warn("API error in generateMetadata, using fallback data:", apiError);
    }

    const seoTitle = seo?.seoTitle || course?.title || "Teacher Cool Course";
    const metaDescription =
      seo?.metaDescription || course?.description?.slice(0, 160) || "Explore our courses on Teacher Cool";
    const metaKeywords = seo?.metaKeywords || "courses, education, learning";

    return {
      title: seoTitle,
      description: metaDescription,
      keywords: metaKeywords,
      alternates: {
        canonical: `https://teachercool.com/courses/${slug}/`,
      },
      openGraph: {
        title: seoTitle,
        description: metaDescription,
        url: `https://teachercool.com/courses/${slug}/`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Course - Teacher Cool",
      description: "Explore our courses on Teacher Cool",
      alternates: {
        canonical: `https://teachercool.com/courses/${slug}/`,
      },
    };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = params;
  // console.log("page slug:", slug);

  try {
    let allCourseList: any[] = [];
    try {
      const allCourseResponse = await HomeApiService.getCourseList();
      allCourseList = allCourseResponse?.results || [];
    } catch (error) {
      console.error("Error fetching course list:", error);
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Temporary Server Issue</h1>
          <p className="text-gray-600">We're having trouble loading courses right now. Please try again later.</p>
        </div>
      );
    }

    // IMPROVED MATCHING LOGIC
    const matchedCourse: any = allCourseList.find((item: any) => {
      if (!item || !item.title) return false;
      
      // Normalize both the course title and the URL slug for comparison
      const courseSlug = slugify(item.title);
      const urlSlug = slugify(slug);
      
      // Direct match
      if (courseSlug === urlSlug) return true;
      
      // Case-insensitive match as fallback
      if (courseSlug.toLowerCase() === urlSlug.toLowerCase()) return true;
      
      // Partial match for longer titles
      if (courseSlug.includes(urlSlug) || urlSlug.includes(courseSlug)) {
        // console.log("Partial match found:", { courseSlug, urlSlug });
        return true;
      }
      
      return false;
    });

    // console.log("Matched course:", matchedCourse);

    if (!matchedCourse) {
      // Show available courses for debugging
      // console.log("Available courses:", allCourseList.map(c => ({
      //   id: c.id,
      //   title: c.title,
      //   slug: slugify(c.title)
      // })));
      
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500">Slug: {slug}</p>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Available Courses:</h3>
            <ul className="space-y-2">
              {allCourseList.slice(0, 10).map((course) => (
                <li key={course.id}>
                  <a 
                    href={`/courses/${slugify(course.title)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {course.title} → {slugify(course.title)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // console.log("matchedId", matchedCourse?.id)

    // Rest of your code for fetching course details...
    let course = null;
    try {
      // const courseData = await HomeApiService.getCourseById(matchedCourse?.id);
      const courseData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lms/course/${matchedCourse.id}/get`)
      // console.log("courseData", courseData)
      course = courseData?.data;
      // console.log("coures",course)
    } catch (error) {
      console.error("Error fetching course details:", error);
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Course Unavailable</h1>
          <p className="text-gray-600">We're having trouble loading this course. Please try again later.</p>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <CourseDetails specificCourse={course.data} />
      </div>
    );
  } catch (error) {
    console.error("Unexpected error in CourseDetailPage:", error);
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something Went Wrong</h1>
        <p className="text-gray-600">We're experiencing technical difficulties. Please try again later.</p>
      </div>
    );
  }
}



// import HomeApiService from "@/services/homeApi";
// import CourseDetails from "@/components/CoursDetailPage.tsx/CourseDetails";
// // import Courses from "@/components/Courses"; // ⬅️ Make sure this import path is correct
// import { seoData } from "@/data/seoData";

// interface PageProps {
//   params: {
//     slug: string;
//   };
// }
//  const toSlug = (text: string) =>
//     text
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "") // remove special chars
//       .trim()
//       .replace(/\s+/g, "-")
// // ✅ Generate SEO dynamically
// export async function generateMetadata({ params }: PageProps) {
//   const { slug} = params;

//   const normalizeSlug = (text: string) =>
//     text
//       ?.toLowerCase()
//       ?.trim()
//       ?.replace(/[^a-z0-9]+/g, "-")
//       ?.replace(/^-+|-+$/g, "");

//   const seo = seoData.find((item) => {
//     const seoSlug = normalizeSlug(item.courseName);
//     const paramSlug = normalizeSlug(slug);
//     return seoSlug === paramSlug;
//   });
//    const allCourseResponse = await HomeApiService.getCourseList();
//   const allCourseList = allCourseResponse?.results || [];

//   const matchedCourse:any = allCourseList.find(
//     (item: any) => toSlug(item.title) === slug
//   );

//   // Fetch course to use as fallback
//   const courseData = await HomeApiService.getCourseById(matchedCourse?.id);
//   const course = courseData?.data;

//   const seoTitle = seo?.seoTitle || course?.title || "Teacher Cool Course";
//   const metaDescription =
//     seo?.metaDescription || course?.description?.slice(0, 160) || "";
//   const metaKeywords = seo?.metaKeywords;

//   return {
//     title: seoTitle,
//     description: metaDescription,
//     keywords: metaKeywords,
//     alternates: {
//       canonical: `https://teachercool.com/courses/${slug}/`,
//     },
//     openGraph: {
//       title: seoTitle,
//       description: metaDescription,
//       url: `https://teachercool.com/courses/${slug}/`,
//       type: "website",
//     },
//   };
// }

// // ✅ The actual page component
// export default async function CourseDetailPage({ params }: PageProps) {
//   const { slug } = params;

//   // Fetch all courses (API likely returns { data: [...] })
//   const allCourseResponse = await HomeApiService.getCourseList();
//   const allCourseList = allCourseResponse?.results || [];

//   const matchedCourse:any = allCourseList.find(
//     (item: any) => toSlug(item.title) === slug
//   );

//   // Handle not found case
//   if (!matchedCourse) {
//     return (
//       <div className="text-center py-20 text-red-500 text-lg">
//         Course not found.
//       </div>
//     );
//   }

//   // Fetch specific course details by ID
//   const courseData = await HomeApiService.getCourseById(matchedCourse?.id);
//   const course = courseData?.data;

//   return (
//     <div className="space-y-10">
//       {/* Course Details Section */}
//       <CourseDetails specificCourse={course} />
//     </div>
//   );
// }


