import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  
  return contactContent.locations.map(location => ({
    location: generateLocationSlug(location.address.city, location.address.state)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  try {
    const { location } = await params;
    const contactContent = await getContactContent();
    const locationData = findLocationBySlug(contactContent.locations, location);
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();
    
    if (!locationData) {
      return {
        title: "Location not found",
        description: "The requested location could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    const title = siteConfig.site_name;
    const description = `Browse all our services in ${locationData.address.city}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Services in ${locationData.address.city} | ${title}`,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: `/${location}/services`,
      },
      openGraph: {
        title: `Services in ${locationData.address.city} | ${title}`,
        description: description,
        type: "website",
        url: `${siteConfig.site_domain}/${location}/services`,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Services in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Services in ${locationData.address.city} | ${title}`,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Services in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Services",
      description: "Browse all our services",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationServicesPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    const locationData = findLocationBySlug(contactContent.locations, location);
    
    if (!locationData) {
      return notFound();
    }
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    const services = transformServicesToSchema(servicesContent);
    
    return (
      <>
        {/* Structured Data for Services Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.LocationServicesPage locationData={locationData} servicesContent={servicesContent} contactContent={contactContent} />
      </>
    );
  } catch (error) {
    console.error('Error in LocationServicesPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationServicesPage locationData={null} servicesContent={null} contactContent={null} />;
  }
} 