import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const BASE = "https://teachercool.com";
const APP_DIR = path.join(process.cwd(), "app");

export const dynamic = "force-dynamic";

/**
 * ROUTES TO EXCLUDE FROM STATIC SITEMAP
 * Add anything private, dashboard, cart, login, etc.
 */
const EXCLUDE_ROUTES = [
  "api",
  "sitemap.xml",
  "sitemap",
  "category",                      // optional
  "dashboard",
  "cart",
  "login",
  "users",
  "profile",
  "register",
  "(admin)",            // if you ever add route groups
];

/**
 * Recursively collects static routes from /app
 */
function getStaticRoutes(dir: string, currentPath = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes: string[] = [];

  for (const entry of entries) {
    const name = entry.name;

    // Skip excluded folders
    if (EXCLUDE_ROUTES.includes(name)) continue;

    // Skip dynamic routes
    if (name.startsWith("[") && name.endsWith("]")) continue;

    // Skip internal Next.js folders
    if (name.startsWith("_")) continue;

    const fullPath = path.join(dir, name);
    const routePath = `${currentPath}/${name}`.replace(/\/+/g, "/");

    if (entry.isDirectory()) {
      // If directory contains page.tsx OR page.js → it's a route
      const hasPageFile = fs
        .readdirSync(fullPath)
        .some((file) => file.startsWith("page."));

      if (hasPageFile) {
        routes.push(routePath);
      }

      // Recursively explore nested routes
      routes = routes.concat(getStaticRoutes(fullPath, routePath));
    }
  }

  return routes;
}

export async function GET() {
  const lastmod = new Date().toISOString();

  // Get all static routes from app/
  let routes = getStaticRoutes(APP_DIR);

  // Add root route manually
  routes.unshift("");

  // Final XML format
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = `${BASE}${route}`;
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.80</priority>
  </url>`;
  })
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
