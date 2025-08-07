import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { OrganizationSchema } from "@/components/StructuredData";
import { transformToOrganizationSchema } from "@/lib/structured-data-helpers";
import { getContactContent, getThemeOptions } from "@/lib/wordpress";
import { getSiteConfig } from "@/site.config";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.blogMetadata();
}

export const dynamic = "auto";
export const revalidate = 600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  try {
    const [contactContent, themeOptions, siteConfig] = await Promise.all([
      getContactContent(),
      getThemeOptions(),
      getSiteConfig()
    ]);
    
    // Transform data for structured data
    const organization = transformToOrganizationSchema(themeOptions, contactContent, siteConfig.site_domain);
    
    return (
      <>
        {/* Structured Data for Blog Page */}
        {organization && (
          <OrganizationSchema organization={organization} />
        )}
        
        {/* Template Component */}
        <template.BlogPage searchParams={searchParams} />
      </>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    // Return template without structured data if there's an error
    return <template.BlogPage searchParams={searchParams} />;
  }
}
