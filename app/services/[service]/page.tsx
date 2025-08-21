import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ServiceSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";
import { ServiceItem } from "@/lib/wordpress.d";

export async function generateStaticParams() {
  const servicesContent = await getServicesContent();
  
  return servicesContent.services.map((service: ServiceItem) => ({
    service: service.slug
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  try {
    const { service } = await params;
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    
    if (!serviceData) {
      return {
        title: "Service not found",
        description: "The requested service could not be found",
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      };
    }

    const title = siteConfig.site_name;
    const description = serviceData.description || `Professional ${serviceData.title} services at ${title}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `${serviceData.title} | ${title}`,
      description,
      openGraph: {
        title: `${serviceData.title} | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/services/${service}`,
        images: serviceData.featured_image?.url ? [{ url: serviceData.featured_image.url }] : logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${serviceData.title} | ${title}`,
        description,
        images: serviceData.featured_image?.url ? [serviceData.featured_image.url] : logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for service page:', error);
    return {
      title: "Service",
      description: "Professional service details",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    const serviceData = servicesContent.services.find((s: ServiceItem) => s.slug === service);
    
    if (!serviceData) {
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
    
    return (
      <>
        {/* Structured Data for Service Page */}
        {business && (
          <>
            <ServiceSchema 
              service={serviceSchema}
              business={{
                name: themeOptions.general.site_name,
                url: siteConfig.site_domain,
                address: business.address
              }}
            />
            
            <LocalBusinessSchema 
              business={business}
              services={services}
            />
          </>
        )}
        
        {/* Template Component */}
        <template.ServiceDetailPage serviceData={serviceData} contactContent={contactContent} themeOptions={themeOptions} />
      </>
    );
  } catch (error) {
    console.error('Error in ServiceDetailPage:', error);
    // Return template without structured data if there's an error
    return <template.ServiceDetailPage serviceData={null} contactContent={null} themeOptions={null} />;
  }
}
