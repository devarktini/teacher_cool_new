import { NextResponse } from "next/server";

const BASE = "https://teachercool.com";

export const dynamic = "force-dynamic";

export async function GET() {
  const lastmod = new Date().toISOString();


  //  <sitemap>
  //   <loc>${BASE}/sitemap/blogs.xml</loc>
  //   <lastmod>${lastmod}</lastmod>
  // </sitemap>


  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${BASE}/sitemap/static.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE}/sitemap/courses.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

 
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
