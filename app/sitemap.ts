import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.teachercool.com";

  return [
    {
      url: `${baseUrl}/sitemaps/static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemaps/courses.xml`,
      lastModified: new Date(),
    },
    // {
    //   url: `${baseUrl}/sitemaps/categories.xml`,
    //   lastModified: new Date(),
    // },
  ];
}





// // app/sitemap.ts
// import { MetadataRoute } from "next";

// const BASE_URL = "https://teachercool.com";

// async function getAllCourses() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_courses/?all_data=true`,
//       {
//         next: { revalidate: 3600 }, // regenerate every 1 hour
//       }
//     );

//     const data = await res.json();
//     return data?.results || data || [];
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return [];
//   }
// }

// async function getAllCategories() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/lms/category/?all_data=true`,
//       {
//         next: { revalidate: 3600 },
//       }
//     );

//     const data = await res.json();
//     return data?.results || data || [];
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }

//   /* ================= STATIC ROUTES ================= */
//   const staticRoutes = [
//     "",
//     "/about",
//     "/contact",
//     "/privacy-policy",
//     "/terms-and-conditions",
//     "/for-individuals",
//     "/corporates",
//     "/universities",
//     "/careers",
//     "/blogs",
//   ].map((route) => ({
//     url: `${BASE_URL}${route}`,
//     lastModified: new Date(),
//     changeFrequency: "monthly" as const,
//     priority: route === "" ? 1 : 0.6,
//   }));

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const courses = await getAllCourses();
//   const categories = await getAllCategories();

//   // Course URLs
//   const courseUrls = courses.map((course: any) => ({
//     url: `${BASE_URL}/courses/${course.slug}/`,
//     lastModified: new Date(course.updated_at || Date.now()),
//     changeFrequency: "weekly" as const,
//     priority: 0.8,
//   }));

//   // Category URLs
//   const categoryUrls = categories.map((cat: any) => ({
//     url: `${BASE_URL}/courses/${cat.slug}/`,
//     lastModified: new Date(cat.updated_at || Date.now()),
//     changeFrequency: "weekly" as const,
//     priority: 0.7,
//   }));

//   return [
//     {
//       url: BASE_URL,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1,
//     },
//     ...courseUrls,
//     ...categoryUrls,
//     ...staticRoutes,
//   ];
// }
