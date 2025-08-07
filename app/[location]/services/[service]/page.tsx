import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug } from "@/lib/utils";
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
  
  const params: Array<{ location: string; service: string }> = [];
  
  contactContent.locations.forEach(location => {
    const locationSlug = generateLocationSlug(location.address.city, location.address.state);
    
    servicesContent.services.forEach(service => {
      params.push({
        location: locationSlug,
        service: service.slug
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; service: string }> }): Promise<Metadata> {
  try {
    const { location, service } = await params;
    const [contactContent, servicesContent] = await Promise.all([
      getContactContent(),
      getServicesContent()
    ]);
    
    const locationData = findLocationBySlug(contactContent.locations, location);
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();

    if (!locationData || !serviceData) {
      return {
        title: "Service not found",
        description: "The requested service could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    const title = siteConfig.site_name;
    const description = serviceData.description;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${serviceData.title} in ${locationData.address.city} | ${title}`,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: `/${location}/services/${service}`,
      },
      openGraph: {
        title: `${serviceData.title} in ${locationData.address.city} | ${title}`,
        description: description,
        type: "website",
        url: `${siteConfig.site_domain}/${location}/services/${service}`,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`${serviceData.title} in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${serviceData.title} in ${locationData.address.city} | ${title}`,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`${serviceData.title} in ${locationData.address.city} | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Service",
      description: "Service details",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function LocationServiceDetailPage({ params }: { params: Promise<{ location: string; service: string }> }) {
  const { location, service } = await params;
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
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    
    if (!locationData || !serviceData) {
      return notFound();
    }
    
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
      url: siteConfig.site_domain
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
        <template.LocationServiceDetailPage locationData={locationData} serviceData={serviceData} />
      </>
    );
  } catch (error) {
    console.error('Error in LocationServiceDetailPage:', error);
    // Return template without structured data if there's an error
    return <template.LocationServiceDetailPage locationData={null} serviceData={null} />;
  }
} 