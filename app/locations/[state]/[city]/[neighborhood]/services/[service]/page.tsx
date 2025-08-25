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
  const [contactContent, servicesContent] = await Promise.all([
    getContactContent(),
    getServicesContent()
  ]);
  
  const seoLocationsWithNeighborhoods = getSEOLocationsWithNeighborhoods(contactContent.seo_locations);
  const params = [];

  for (const location of seoLocationsWithNeighborhoods) {
    for (const service of servicesContent.services || []) {
      params.push({
        state: getStateFullName(location.address.state),
        city: location.address.city.toLowerCase().replace(/\s+/g, '-'),
        neighborhood: location.address.neighborhood.toLowerCase().replace(/\s+/g, '-'),
        service: service.slug
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { 
  params: Promise<{ state: string; city: string; neighborhood: string; service: string }> 
}): Promise<Metadata> {
  try {
    const { state, city, neighborhood, service } = await params;
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
    
    // Find service data
    const serviceData = servicesContent.services?.find(s => s.slug === service);
    
    if (!seoLocationData || !serviceData) {
      return {
        title: "Service not found",
        description: "The requested service in this neighborhood could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);

    const title = siteConfig.site_name;
    const description = `${serviceData.title} in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state}. Professional ${serviceData.title.toLowerCase()} services in your neighborhood.`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${serviceData.title} in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `${serviceData.title} in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}/${neighborhood}/services/${service}`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${serviceData.title} in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for neighborhood service detail page:', error);
    return {
      title: "Neighborhood Service",
      description: "Professional service in your neighborhood",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function NeighborhoodServiceDetailPage({ params }: { 
  params: Promise<{ state: string; city: string; neighborhood: string; service: string }> 
}) {
  const { state, city, neighborhood, service } = await params;
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
    
    // Find service data
    const serviceData = servicesContent.services?.find(s => s.slug === service);
    
    if (!seoLocationData || !serviceData) {
      return notFound();
    }
    
    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);
    
    // Transform data for structured data
    const business = transformContactToNeighborhoodBusiness(contactContent, themeOptions, siteConfig.site_domain, seoLocationData);
    const services = transformServicesToSchema(servicesContent);
    
    return (
      <>
        {/* Structured Data for Neighborhood Service Detail Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.NeighborhoodServiceDetailPage 
          seoLocationData={seoLocationData}
          mainLocationData={mainLocationData}
          serviceData={serviceData}
          servicesContent={servicesContent} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in NeighborhoodServiceDetailPage:', error);
    // Return template without structured data if there's an error
    return <template.NeighborhoodServiceDetailPage seoLocationData={null} mainLocationData={null} serviceData={null} servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
