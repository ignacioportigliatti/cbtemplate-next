import { MetadataRoute } from "next";
import { getAllPosts, getContactContent, getServicesContent, getAboutUsContent } from "@/lib/wordpress";
import { getSiteConfig } from "@/site.config";
import { getStateFullName } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, contactContent, servicesContent, aboutUsContent, siteConfig] = await Promise.all([
    getAllPosts(),
    getContactContent(),
    getServicesContent(),
    getAboutUsContent(),
    getSiteConfig(),
  ]);

  // Get all locations for SEO - physical and virtual
  const allLocations = contactContent?.locations || [];
  const physicalLocations = allLocations.filter(location => location.physical_location === true);
  const mainLocation = physicalLocations[0]; // Use first physical location for main pages

  // Core static URLs with highest priority
  const coreUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  // All location URLs - physical locations with high priority, virtual with lower priority
  const locationUrls: MetadataRoute.Sitemap = [];
  
  allLocations.forEach((location) => {
    const stateSlug = getStateFullName(location.address.state);
    const citySlug = location.address.city.toLowerCase().replace(/\s+/g, '-');
    const isPhysical = location.physical_location === true;
    const basePriority = isPhysical ? 0.9 : 0.5; // Physical locations get higher priority
    
    locationUrls.push(
      {
        url: `${siteConfig.site_domain}/locations/${stateSlug}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: basePriority,
      },
      {
        url: `${siteConfig.site_domain}/locations/${stateSlug}/${citySlug}/services`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: basePriority - 0.1,
      },
      {
        url: `${siteConfig.site_domain}/locations/${stateSlug}/${citySlug}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: basePriority - 0.2,
      },
      {
        url: `${siteConfig.site_domain}/locations/${stateSlug}/${citySlug}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: basePriority - 0.2,
      }
    );

    // Service detail pages for all locations
    if (servicesContent?.services) {
      servicesContent.services.forEach((service) => {
        locationUrls.push({
          url: `${siteConfig.site_domain}/locations/${stateSlug}/${citySlug}/services/${service.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: basePriority - 0.3,
        });
      });
    }
  });

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
