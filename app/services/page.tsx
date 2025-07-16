import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.servicesMetadata();
}

export default async function ServicesPage() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.ServicesPage />;
}
