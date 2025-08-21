import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug, getStateAbbreviation } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  
  // Generate pages for ALL locations (physical and virtual) for SEO
  return contactContent.locations.map(location => ({
    state: getStateAbbreviation(location.address.state),
    city: location.address.city.toLowerCase().replace(/\s+/g, '-')
  }));
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
    const stateAbbr = getStateAbbreviation(state);
    const locationSlug = `${city.replace(/-/g, ' ')}-${stateAbbr}`;
    
    // Find location using the existing utility function
    const locationData = findLocationBySlug(contactContent.locations, locationSlug);
    
    if (!locationData) {
      return {
        title: "Services not found",
        description: "The requested services could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    const title = siteConfig.site_name;
    const description = `Professional services in ${locationData.address.city}, ${locationData.address.state}. Browse our complete range of services.`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Services in ${locationData.address.city}, ${locationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `Services in ${locationData.address.city}, ${locationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}/services`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `Services in ${locationData.address.city}, ${locationData.address.state} | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for location services page:', error);
    return {
      title: "Services",
      description: "Professional services in your area",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationServicesPage({ params }: { params: Promise<{ state: string; city: string }> }) {
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
    const stateAbbr = getStateAbbreviation(state);
    const locationSlug = `${city.replace(/-/g, ' ')}-${stateAbbr}`;
    
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
        {/* Structured Data for Location Services Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.LocationServicesPage 
          locationData={locationData} 
          servicesContent={servicesContent} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in LocationServicesPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationServicesPage locationData={null} servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
