// app/courses/[slug]/page.tsx

// export const dynamic = "force-dynamic";

import CourseDetails from "@/components/CoursDetailPage/CourseDetails";
import CategoryCourses from "@/components/Home/CategoryCourses";
import MainCourse from "@/components/NewCourseDetailPage/MainCourse";
import HomeApiService from "@/services/homeApi";
import axios from "axios";


interface PageProps {
  params: {
    slug: string;
  };
}

const getSlug = async (slug: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lms/course-slug/by-slug/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching slug:", error);
    return null; 
  }
};

const getCourse = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lms/course/${id}/get`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null; 
  }
};

const getSeoData = async (params: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lms/seo-data/by-entity/?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching seo data:", error);
    return null;
  }
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;

  try {
   
    const slugData = await getSlug(slug);
    const courseId = slugData?.course;

    /* ================= COURSE SEO ================= */
    if (courseId) {
      const seoData = await getSeoData(`course_id=${courseId}`);
      const seoTitle = seoData?.title || "Teacher Cool Course";
      const metaDescription = seoData?.description || "Explore our courses on Teacher Cool";
      const metaKeywords = seoData?.keywords || "courses, education, learning";

      return {
        title: seoTitle,
        description: metaDescription,
        keywords: metaKeywords,
        alternates: {
          canonical: `https://www.teachercool.com/courses/${slug}/`,
        },
        openGraph: {
          title: seoTitle,
          description: metaDescription,
          url: `https://www.teachercool.com/courses/${slug}/`,
          type: "website",
        },
      };
    }

    /* ================= CATEGORY SEO ================= */
    const catName = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const res: any = await HomeApiService.getAllCategory({all_data: true});
    const matchedCategory = res?.results?.find( (item: any) =>item.cat_name.toLowerCase() === catName.toLowerCase());
    if (matchedCategory?.id) {
      const seoData = await getSeoData(
        `category_id=${matchedCategory.id}`
      );

      const seoTitle = seoData?.title || catName;
      const metaDescription = seoData?.description || `Explore our courses on ${catName} category at Teacher Cool`;
      const metaKeywords = seoData?.keywords || `${catName}, courses, education, learning`;

      return {
        title: seoTitle,
        description: metaDescription,
        keywords: metaKeywords,
        alternates: {
          canonical: `https://www.teachercool.com/courses/${slug}/`,
        },
        openGraph: {
          title: seoTitle,
          description: metaDescription,
          url: `https://www.teachercool.com/courses/${slug}/`,
          type: "website",
        },
      };
    }

    /* ================= FALLBACK ================= */
    return {
      title: "Course - Teacher Cool",
      description: "Explore our courses on Teacher Cool",
      alternates: {
        canonical: `https://www.teachercool.com/courses/${slug}/`,
      },
    };
  } catch (error) {
    return {
      title: "Course - Teacher Cool",
      description: "Explore our courses on Teacher Cool",
      alternates: {
        canonical: `https://www.teachercool.com/courses/${slug}/`,
      },
    };
  }
}


export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = params;
  // console.log("slug",slug)
  const slugData = await getSlug(slug);
 
  if (!slugData?.course) {
      const categoryName = slug.replace(/-/g, ' ');
   
      return (<CategoryCourses  category={categoryName}/>)
    // return notFoundUI();
  }

  const courseData = await getCourse(slugData?.course);
  const course = courseData?.data;

  if (!course) {
    return notFoundUI();
  }

  return (
    <div className="space-y-10">
      <CourseDetails specificCourse={course} />
      {/* <MainCourse specificCourse={course} /> */}
    </div>
  );
}

function notFoundUI() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
        <div className="text-4xl mb-4">🎓</div>
        <h1 className="text-2xl font-semibold mb-2">Course Not Found</h1>
        <p className="text-gray-600 mb-6">
          The course you’re looking for doesn’t exist or was removed.
        </p>
        <a
          href="/courses"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Browse Courses
        </a>
      </div>
    </div>
  );
}

