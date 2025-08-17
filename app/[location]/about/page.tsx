import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getAboutUsContent, getContactContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness } from "@/lib/structured-data-helpers";
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
    const description = `Learn more about our company in ${locationData.address.city}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `About Us in ${locationData.address.city} | ${title}`,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: `/${location}/about`,
      },
      openGraph: {
        title: `About Us in ${locationData.address.city} | ${title}`,
        description: description,
        type: "website",
        url: `${siteConfig.site_domain}/${location}/about`,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`About Us in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `About Us in ${locationData.address.city} | ${title}`,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`About Us in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "About Us",
      description: "Learn more about our company",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationAboutPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [aboutUsContent, contactContent, themeOptions, siteConfig] = await Promise.all([
      getAboutUsContent(),
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    const locationData = findLocationBySlug(contactContent.locations, location);
    
    if (!locationData) {
      return notFound();
    }
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    
    return (
      <>
        {/* Structured Data for About Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
          />
        )}
        
        {/* Template Component */}
        <template.LocationAboutPage locationData={locationData} aboutUsContent={aboutUsContent} contactContent={contactContent} themeOptions={themeOptions} />
      </>
    );
  } catch (error) {
    console.error('Error in LocationAboutPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationAboutPage locationData={null} aboutUsContent={null} contactContent={null} />;
  }
} 