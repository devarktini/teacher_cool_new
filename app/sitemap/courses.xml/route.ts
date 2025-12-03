import { NextResponse } from "next/server";

const BASE_URL = "https://teachercool.com";
const API_BASE =
  "https://api.teachercool.com/";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch(`${API_BASE}&page=1`, { cache: "no-store" });
  const data = await res.json();

  const totalPages = data.total_pages || 1;
  const lastmod = new Date().toISOString();

  const entries = Array.from({ length: totalPages }).map((_, idx) => {
    const page = String(idx + 1).padStart(2, "0");
    return `
  <sitemap>
    <loc>${BASE_URL}/sitemap/products.xml/${page}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
