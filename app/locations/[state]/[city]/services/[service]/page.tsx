import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findSEOLocationByCitySlug, getStateAbbreviation, getStateFullName, getMainPhysicalLocation } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ServiceSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";
import { ServiceItem } from "@/lib/wordpress.d";

export async function generateStaticParams() {
  const [contactContent, servicesContent] = await Promise.all([
    getContactContent(),
    getServicesContent()
  ]);
  
  const params: Array<{ state: string; city: string; service: string }> = [];
  
  // Generate pages for ALL SEO locations for better local SEO
  contactContent.seo_locations.forEach(location => {
    const stateSlug = getStateFullName(location.address.state);
    const citySlug = location.address.city.toLowerCase().replace(/\s+/g, '-');
    
    servicesContent.services.forEach(service => {
      params.push({
        state: stateSlug,
        city: citySlug,
        service: service.slug
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string; service: string }> }): Promise<Metadata> {
  try {
    const { state, city, service } = await params;
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
    
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    
    if (!seoLocationData || !serviceData) {
      return {
        title: "Service not found",
        description: "The requested service could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);

    const title = siteConfig.site_name;
    const description = `${serviceData.title} in ${seoLocationData.address.city}, ${seoLocationData.address.state}. ${serviceData.description}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${serviceData.title} in ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
      description,
      openGraph: {
        title: `${serviceData.title} in ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/locations/${state}/${city}/services/${service}`,
        images: serviceData.featured_image?.url ? [{ url: serviceData.featured_image.url }] : logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${serviceData.title} in ${seoLocationData.address.city}, ${seoLocationData.address.state} | ${title}`,
        description,
        images: serviceData.featured_image?.url ? [serviceData.featured_image.url] : logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for location service page:', error);
    return {
      title: "Service",
      description: "Professional service details",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationServiceDetailPage({ params }: { params: Promise<{ state: string; city: string; service: string }> }) {
  const { state, city, service } = await params;
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
    
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    
    if (!seoLocationData || !serviceData) {
      return notFound();
    }
    
    // Get main location for contact data
    const mainLocationData = getMainPhysicalLocation(contactContent.locations);
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    const services = transformServicesToSchema(servicesContent);
    
    // Create service schema
    const serviceSchema = {
      name: serviceData.title,
      description: serviceData.description,
      image: serviceData.featured_image?.url || undefined,
      price: undefined,
      duration: undefined
    };
    
    const businessSchema = {
      name: themeOptions.general.site_name,
      url: siteConfig.site_domain,
      address: business?.address || {
        street: seoLocationData.address.street,
        city: seoLocationData.address.city,
        state: seoLocationData.address.state,
        zipCode: seoLocationData.address.zip_code,
        country: seoLocationData.address.country
      }
    };
    
    return (
      <>
        {/* Structured Data for Service Page */}
        <ServiceSchema 
          service={serviceSchema}
          business={businessSchema}
        />
        
        {business && (
          <LocalBusinessSchema 
            business={business}
            services={services}
          />
        )}
        
        {/* Template Component */}
        <template.LocationServiceDetailPage 
          seoLocationData={seoLocationData}
          mainLocationData={mainLocationData}
          serviceData={serviceData} 
          contactContent={contactContent} 
          themeOptions={themeOptions} 
        />
      </>
    );
  } catch (error) {
    console.error('Error in LocationServiceDetailPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationServiceDetailPage seoLocationData={null} mainLocationData={null} serviceData={null} contactContent={null} themeOptions={null} />;
  }
}
