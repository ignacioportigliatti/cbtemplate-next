import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateStaticParams() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return template.serviceDetailStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return template.serviceDetailMetadata({ params });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.ServiceDetailPage params={params} />;
}
