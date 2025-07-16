import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

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
  
  return <template.BlogPage searchParams={searchParams} />;
}
