import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.blogCategoriesMetadata();
}

export default async function BlogCategoriesPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.BlogCategoriesPage />;
}
