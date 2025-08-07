import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getPostBySlug } from "@/lib/wordpress";
import { ArticleSchema } from "@/components/StructuredData";
import { transformPostToArticleSchema } from "@/lib/structured-data-helpers";
import { getSiteConfig } from "@/site.config";

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
  
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const siteConfig = await getSiteConfig();
    
    // Transform post data for structured data
    const articleSchema = transformPostToArticleSchema(post, siteConfig.site_domain);
    
    return (
      <>
        {/* Structured Data for Blog Post */}
        <ArticleSchema article={articleSchema} />
        
        {/* Template Component */}
        <template.BlogPostPage params={params} />
      </>
    );
  } catch (error) {
    console.error('Error in BlogPostPage:', error);
    // Return template without structured data if there's an error
    return <template.BlogPostPage params={params} />;
  }
}
