import { NextResponse } from "next/server";
// curl http://localhost:3000/sitemaps/categories.xml  run this to check console or response 
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

async function getAllCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}lms/category/get_categories/?all_data=true`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("API Error:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    // console.log("Categories API response:", data);

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
      <loc>${BASE_URL}/courses/${slugify(cat.cat_name)}/</loc>
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





// import { NextResponse } from "next/server";

// const BASE_URL = "https://teachercool.com";

// async function getAllCategories() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/lms/category/?all_data=true`,
//       { next: { revalidate: 3600 } }
//     );

//     const data = await res.json();
//     return data?.results || [];
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }

// export async function GET() {
//   const categories = await getAllCategories();

//   const urls = categories
//     .map(
//       (cat: any) => `
//     <url>
//       <loc>${BASE_URL}/courses/${cat.cat_name}/</loc>
//       <lastmod>${new Date(
//         cat.updated_at || Date.now()
//       ).toISOString()}</lastmod>
//       <changefreq>weekly</changefreq>
//       <priority>0.7</priority>
//     </url>`
//     )
//     .join("");

//   const xml = `<?xml version="1.0" encoding="UTF-8"?>
//   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     ${urls}
//   </urlset>`;

//   return new NextResponse(xml, {
//     headers: {
//       "Content-Type": "application/xml",
//     },
//   });
// }
