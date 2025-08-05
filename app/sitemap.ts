import { MetadataRoute } from "next";
import { getAllPosts, getContactContent, getServicesContent, getAboutUsContent } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { generateLocationSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, contactContent, servicesContent, aboutUsContent] = await Promise.all([
    getAllPosts(),
    getContactContent(),
    getServicesContent(),
    getAboutUsContent(),
  ]);

  // Get main location (index 0) - SEO focused on primary location
  const mainLocation = contactContent?.locations?.[0];

  // Core static URLs with highest priority
  const coreUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  // Main location URLs with high priority
  const locationUrls: MetadataRoute.Sitemap = [];
  if (mainLocation) {
    const locationSlug = generateLocationSlug(mainLocation.address.city, mainLocation.address.state);
    
    locationUrls.push(
      {
        url: `${siteConfig.site_domain}/${locationSlug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${siteConfig.site_domain}/${locationSlug}/services`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${siteConfig.site_domain}/${locationSlug}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${siteConfig.site_domain}/${locationSlug}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }
    );

    // Service detail pages for main location - high priority for local SEO
    if (servicesContent?.services) {
      servicesContent.services.forEach((service) => {
        locationUrls.push({
          url: `${siteConfig.site_domain}/${locationSlug}/services/${service.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      });
    }
  }

  // Blog section URLs
  const blogUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/blog/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.site_domain}/blog/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.site_domain}/blog/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Blog post URLs - optimized for content freshness
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Additional SEO-optimized URLs
  const seoUrls: MetadataRoute.Sitemap = [
    // Service pages without location (if they exist)
    ...(servicesContent?.services?.map((service) => ({
      url: `${siteConfig.site_domain}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })) || []),
    
    // About page without location
    {
      url: `${siteConfig.site_domain}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    
    // Contact page without location
    {
      url: `${siteConfig.site_domain}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [
    ...coreUrls,      // Homepage (highest priority)
    ...locationUrls,  // Location-specific pages (high priority)
    ...blogUrls,      // Blog section pages
    ...postUrls,      // Individual blog posts
    ...seoUrls,       // Additional SEO pages
  ];
}
