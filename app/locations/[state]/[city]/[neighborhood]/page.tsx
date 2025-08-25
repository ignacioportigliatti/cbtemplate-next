import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { 
  generateNeighborhoodSlug, 
  findSEOLocationByNeighborhoodSlug, 
  getStateFullName, 
  getSEOLocationsWithNeighborhoods,
  getMainPhysicalLocation
} from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToNeighborhoodBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  const seoLocationsWithNeighborhoods = getSEOLocationsWithNeighborhoods(contactContent.seo_locations);
  
  return seoLocationsWithNeighborhoods.map(location => ({
    state: getStateFullName(location.address.state),
    city: location.address.city.toLowerCase().replace(/\s+/g, '-'),
    neighborhood: location.address.neighborhood.toLowerCase().replace(/\s+/g, '-')
  }));
}

export async function generateMetadata({ params }: { 
  params: Promise<{ state: string; city: string; neighborhood: string }> 
}): Promise<Metadata> {
  try {
    const { state, city, neighborhood } = await params;
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Create the neighborhood slug from parameters
    const neighborhoodSlug = `${state}/${city}/${neighborhood}`;
    
    // Find SEO location using the neighborhood utility function
    const seoLocationData = findSEOLocationByNeighborhoodSlug(contactContent.seo_locations, neighborhoodSlug);
    
    if (!seoLocationData) {
      return {
        title: "Neighborhood not found",
        description: "The requested neighborhood could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);

    const title = siteConfig.site_name;
    const description = `Professional services in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state}. Expert solutions in your neighborhood.`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}/${neighborhood}`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for neighborhood hub page:', error);
    return {
      title: "Neighborhood",
      description: "Professional services in your neighborhood",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function NeighborhoodHubPage({ params }: { 
  params: Promise<{ state: string; city: string; neighborhood: string }> 
}) {
  const { state, city, neighborhood } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Create the neighborhood slug from parameters
    const neighborhoodSlug = `${state}/${city}/${neighborhood}`;
    
    // Find SEO location using the neighborhood utility function
    const seoLocationData = findSEOLocationByNeighborhoodSlug(contactContent.seo_locations, neighborhoodSlug);
    
    if (!seoLocationData) {
      return notFound();
    }
    
    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);
    
    // Transform data for structured data
    const business = transformContactToNeighborhoodBusiness(contactContent, themeOptions, siteConfig.site_domain, seoLocationData);
    const services = transformServicesToSchema(servicesContent);
    
    return (
      <>
        {/* Structured Data for Neighborhood Hub Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.NeighborhoodHubPage 
          seoLocationData={seoLocationData}
          mainLocationData={mainLocationData}
          servicesContent={servicesContent} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in NeighborhoodHubPage:', error);
    // Return template without structured data if there's an error
    return <template.NeighborhoodHubPage seoLocationData={null} mainLocationData={null} servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
