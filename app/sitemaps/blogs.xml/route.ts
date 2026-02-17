import { NextResponse } from "next/server";

const BASE_URL = "https://www.teachercool.com";

function slugify(text: string) {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getBlogs() {
  try {
    const res = await fetch(
      "https://blogapi.gyprc.com/api/blogs/type/TeacherCool",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("API Error:", res.status);
      return [];
    }

    const data = await res.json();
  console.log("data", data)
    // adjust based on API structure
    return data?.blogs || data?.results || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function GET() {
  const blogs = await getBlogs();

  const urls = blogs
    .map(
      (blog: any) => `
    <url>
      <loc>${BASE_URL}/blogs/${slugify(blog.title)}/</loc>
      <lastmod>${new Date(
        blog.updatedAt || blog.updated_at || Date.now()
      ).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
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
