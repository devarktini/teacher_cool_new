// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/login/",
                    "/dashboard/",
                    "/admin/",
                    "/api/",
                    "/cgi-bin/",
                    "https://admin.teachercool.com/",
                ],
            },

            // AI bots (optional)
            {
                userAgent: "GPTBot",
                allow: "/",
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
            },
            {
                userAgent: "ClaudeBot",
                allow: "/",
            },
        ],

        sitemap: "https://www.teachercool.com/sitemap.xml",
    };
}





// // app/robots.ts
// import type { MetadataRoute } from 'next';

// export default function robots(): MetadataRoute.Robots {
//     return {
//         rules: [
//             {
//                 userAgent: '*',
//                 allow: '/',
//                 disallow: [
//                     '/login/',
//                     'https://admin.teachercool.com/',
//                     '/dashboard/',
//                     '/admin/',
//                    ' /api/',
//                     '/cgi-bin/',
//                 ],
//             },

//             // AI bots (optional)
//             {
//                 userAgent: 'GPTBot',
//                 allow: '/',
//             },
//             {
//                 userAgent: 'Google-Extended',
//                 allow: '/',
//             },
//             {
//                 userAgent: 'PerplexityBot',
//                 allow: '/',
//             },
//             {
//                 userAgent: 'ClaudeBot',
//                 allow: '/',
//             },
//         ],
//         sitemap: 'https://www.teachercool.com/sitemap.xml',
//     };
// }
