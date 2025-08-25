import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findSEOLocationByCitySlug, getStateAbbreviation, getStateFullName, getMainPhysicalLocation } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  
  const locationSlugs = contactContent.seo_locations.map(location => ({
    state: getStateFullName(location.address.state),
    city: location.address.city.toLowerCase().replace(/\s+/g, '-')
  }));

  // Generate pages for ALL SEO locations for better local SEO
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
    
    // Find SEO location using the city slug
    const seoLocationData = findSEOLocationByCitySlug(contactContent.seo_locations, locationSlug);
    
    if (!seoLocationData) {
      return {
        title: "Location not found",
        description: "The requested location could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);

    const title = siteConfig.site_name;
    const description = `Professional services in ${seoLocationData.address.city}, ${seoLocationData.address.state}. Contact us for expert solutions.`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
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
    
    // Find SEO location using the city slug
    const seoLocationData = findSEOLocationByCitySlug(contactContent.seo_locations, locationSlug);
    
    if (!seoLocationData) {
      return notFound();
    }
    
    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);
    
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
          seoLocationData={seoLocationData}
          mainLocationData={mainLocationData}
          locationData={null}
          servicesContent={servicesContent} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in LocationHubPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationHubPage seoLocationData={null} mainLocationData={null} servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
