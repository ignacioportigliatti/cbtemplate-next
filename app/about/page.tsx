import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getAboutUsContent, getContactContent, getThemeOptions } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { transformContactToBusiness } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [aboutUsContent, contactContent, themeOptions, siteConfig] = await Promise.all([
      getAboutUsContent(),
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);

    const title = siteConfig.site_name;
    const description = aboutUsContent?.page_info?.description || `Learn more about ${title}`;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `About Us | ${title}`,
      description,
      openGraph: {
        title: `About Us | ${title}`,
        description,
        type: "website",
        url: `${siteConfig.site_domain}/about`,
        images: logoUrl ? [{ url: logoUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `About Us | ${title}`,
        description,
        images: logoUrl ? [logoUrl] : [],
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  } catch (error) {
    console.error('Error generating metadata for about page:', error);
    return {
      title: "About Us",
      description: "Learn more about our company",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function AboutPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [aboutUsContent, contactContent, themeOptions, siteConfig] = await Promise.all([
      getAboutUsContent(),
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Transform data for structured data
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    
    return (
      <>
        {/* Structured Data for About Page */}
        {business && (
          <LocalBusinessSchema 
            business={business}
          />
        )}
        
        {/* Template Component */}
        <template.AboutPage aboutUsContent={aboutUsContent} contactContent={contactContent} themeOptions={themeOptions} />
      </>
    );
  } catch (error) {
    console.error('Error in AboutPage:', error);
    // Return template without structured data if there's an error
    return <template.AboutPage aboutUsContent={null} contactContent={null} themeOptions={null} />;
  }
}
