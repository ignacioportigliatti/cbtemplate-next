import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateStaticParams() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return template.blogPostStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return template.blogPostMetadata({ params });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.BlogPostPage params={params} />;
}
