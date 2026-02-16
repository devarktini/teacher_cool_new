import { NextResponse } from "next/server";

const BASE_URL = "https://teachercool.com";

export async function GET() {
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/for-individuals",
    "/corporates",
    "/universities",
    "/careers",
    "/blogs",
  ];

  const urls = staticPages
    .map(
      (page) => `
    <url>
      <loc>${BASE_URL}${page}</loc>
      <changefreq>monthly</changefreq>
      <priority>${page === "" ? "1.0" : "0.6"}</priority>
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
