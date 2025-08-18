import { getPageBySlug, getAllPages } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Article, Prose } from "@/components/craft";
import type { Metadata } from "next";
import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";
import ScrollAnimations from "@/templates/beauty_care/components/layout/ScrollAnimations";

// Rutas reservadas que no son páginas personalizadas
const reservedRoutes = ["blog", "about", "contact", "services", "team", "reviews"];

export async function generateStaticParams() {
  const pages = await getAllPages();

  // Solo generar rutas para páginas que no conflictúen con rutas existentes
  const customPages = pages.filter((page) => !reservedRoutes.includes(page.slug));

  return customPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // No generar metadata para rutas reservadas
  if (reservedRoutes.includes(slug)) {
    return {};
  }

  try {
    const page = await getPageBySlug(slug);
    return {
      title: page.title.rendered,
      description: page.excerpt.rendered.replace(/<[^>]*>/g, "").trim(),
    };
  } catch (error) {
    return {};
  }
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // No renderizar páginas para rutas reservadas
  if (reservedRoutes.includes(slug)) {
    notFound();
  }

  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      notFound();
    }

    return (
      <ScrollAnimations>
        <Section>
          <Container className="max-w-7xl mx-auto pt-40">
            <div>
              <h1 className="text-4xl font-bold mb-6">{page.title.rendered}</h1>
              <Prose
                className="max-w-none pb-16"
                dangerouslySetInnerHTML={{ __html: page.content.rendered }}
              />
            </div>
              <AboutUsContact />
          </Container>
        </Section>
      </ScrollAnimations>
    );
  } catch (error) { 
    notFound();
  }
}
