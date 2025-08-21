import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug, getStateAbbreviation, getStateFullName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  
    const locationSlugs = contactContent.locations.map(location => ({
      state: getStateFullName(location.address.state),
      city: location.address.city.toLowerCase().replace(/\s+/g, '-')
    }));

  // Generate pages for ALL locations (physical and virtual) for SEO
  return locationSlugs;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  try {
    const { state, city } = await params;
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Create the location slug from state and city parameters
    const locationSlug = `${state}/${city}`;
    
    // Find location using the existing utility function
    const locationData = findLocationBySlug(contactContent.locations, locationSlug);
    
    if (!locationData) {
      return {
        title: "Location not found",
        description: "The requested location could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    const title = siteConfig.site_name;
    const description = `Professional services in ${locationData.address.city}, ${locationData.address.state}. Contact us for expert solutions.`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${locationData.address.city}, ${locationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `${locationData.address.city}, ${locationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${locationData.address.city}, ${locationData.address.state} | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for location hub page:', error);
    return {
      title: "Location",
      description: "Professional services in your area",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationHubPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Create the location slug from state and city parameters
    const locationSlug = `${state}/${city}`;
    
    // Find location using the existing utility function
    const locationData = findLocationBySlug(contactContent.locations, locationSlug);
    
        if (!locationData) {
      return notFound();
    }
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    const services = transformServicesToSchema(servicesContent);
    
    return (
      <>
        {/* Structured Data for Location Hub Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.LocationHubPage 
          locationData={locationData} 
          servicesContent={servicesContent} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in LocationHubPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationHubPage locationData={null} servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
