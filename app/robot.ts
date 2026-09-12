import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/signup", "/api/", "/auth/", "/editor"],
      },
    ],
    sitemap: "https://yogawritecode.com/sitemap.xml",
    host: "https://yogawritecode.com",
  };
}