import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.blogTagsMetadata();
}

export default async function BlogTagsPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.BlogTagsPage />;
}
