import { NextRequest, NextResponse } from "next/server";

const BASE = "https://teachercool.com";
const API_BASE =
  "https://api.teachercool.com/lms/course/list_courses/?all_data=true";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { page: string } }
) {
  const page = params.page.split(".")[0];

  const apiURL = `${API_BASE}&page=${page}`;
  const lastmod = new Date().toISOString();

  try {
    const res = await fetch(apiURL, { cache: "no-store" });
    const data = await res.json();

    if (!data?.results) {
      throw new Error("API returned no results");
    }

    const urls = data.results
      .map(
        (item: any) => `
  <url>
    <loc>${BASE}/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.70</priority>
  </url>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("Sitemap error:", err);

    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
