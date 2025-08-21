import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent, getThemeOptions } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness, transformServicesToSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);

    const title = siteConfig.site_name;
    const description = servicesContent?.page_info?.description || `Browse all our professional services at ${title}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Our Services | ${title}`,
      description,
      openGraph: {
        title: `Our Services | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/services`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `Our Services | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for services page:', error);
    return {
      title: "Our Services",
      description: "Browse all our professional services",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function ServicesPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, servicesContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getServicesContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
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
        <template.ServicesPage servicesContent={servicesContent} contactContent={contactContent} themeOptions={themeOptions} />
      </>
    );
  } catch (error) {
    console.error('Error in ServicesPage:', error);
    // Return template without structured data if there's an error
    return <template.ServicesPage servicesContent={null} contactContent={null} themeOptions={null} />;
  }
}
