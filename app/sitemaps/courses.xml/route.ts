import { NextResponse } from "next/server";

const BASE_URL = "https://teachercool.com";

async function getAllCourses() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_courses/?all_data=true`,
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();
  return data?.results || [];
}

export async function GET() {
  const courses = await getAllCourses();

  const urls = courses
    .map(
      (course: any) => `
    <url>
      <loc>${BASE_URL}/courses/${course.slug}/</loc>
      <lastmod>${new Date(
        course.updated_at || Date.now()
      ).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
