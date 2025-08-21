import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getThemeOptions } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [contactContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);

    const title = siteConfig.site_name;
    const description = contactContent?.page_info?.description || `Contact ${title} for professional services`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Contact Us | ${title}`,
      description,
      openGraph: {
        title: `Contact Us | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/contact`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `Contact Us | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for contact page:', error);
    return {
      title: "Contact Us",
      description: "Get in touch with us for professional services",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function ContactPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    
    return (
      <>
        {/* Structured Data for Contact Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
          />
        )}
        
        {/* Template Component */}
        <template.ContactPage contactContent={contactContent} themeOptions={themeOptions} />
      </>
    );
  } catch (error) {
    console.error('Error in ContactPage:', error);
    // Return template without structured data if there's an error
    return <template.ContactPage contactContent={null} themeOptions={null} />;
  }
}
