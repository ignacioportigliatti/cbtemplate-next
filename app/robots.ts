import { MetadataRoute } from "next";
import { getSiteConfig } from "@/site.config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/blog/*",
          "/about",
          "/contact",
          "/services",
          "/services/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/wp-admin/",
          "/wp-includes/",
          "/wp-content/plugins/",
          "/wp-content/themes/",
          "/*.json$",
          "/*.xml$",
          "/*.txt$",
          "/search?*",
          "/temp/",
          "/cache/",
          "/backup/",
          "/logs/",
          "/config/",
          "/includes/",
          "/vendor/",
          "/node_modules/",
          "/.env",
          "/.git",
          "/.htaccess",
          "/robots.txt",
          "/sitemap.xml",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
        ],
      },
    ],
    sitemap: `${siteConfig.site_domain}/sitemap.xml`,
    host: siteConfig.site_domain,
  };
} 