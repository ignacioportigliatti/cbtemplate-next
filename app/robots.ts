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
          "/locations",
          "/locations/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
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
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/blog",
          "/blog/*",
          "/about",
          "/contact",
          "/services",
          "/services/*",
          "/locations",
          "/locations/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/search?*",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/",
          "/blog",
          "/blog/*",
          "/about",
          "/contact",
          "/services",
          "/services/*",
          "/locations",
          "/locations/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/blog",
          "/blog/*",
          "/about",
          "/contact",
          "/services",
          "/services/*",
          "/locations",
          "/locations/*",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/search?*",
        ],
      },
    ],
    sitemap: `${siteConfig.site_domain}/sitemap.xml`,
    host: siteConfig.site_domain,
  };
} 