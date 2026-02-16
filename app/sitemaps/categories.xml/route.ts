import { NextResponse } from "next/server";

const BASE_URL = "https://teachercool.com";

async function getAllCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lms/category/?all_data=true`,
      { next: { revalidate: 3600 } }
    );

    const data = await res.json();
    return data?.results || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function GET() {
  const categories = await getAllCategories();

  const urls = categories
    .map(
      (cat: any) => `
    <url>
      <loc>${BASE_URL}/courses/${cat.slug}/</loc>
      <lastmod>${new Date(
        cat.updated_at || Date.now()
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
