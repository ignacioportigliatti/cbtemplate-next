import { getAllAuthors, getThemeOptions } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();
    
    const title = siteConfig.site_name;
    const description = "Browse all authors of our blog posts";
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Authors | ${title}`,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: "/blog/authors",
      },
      openGraph: {
        title: `Authors | ${title}`,
        description: description,
        type: "website",
        url: `${siteConfig.site_domain}/blog/authors`,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Authors | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Authors | ${title}`,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Authors | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Authors",
      description: "Browse all authors of our blog posts",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      alternates: {
        canonical: "/blog/authors",
      },
    };
  }
}

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h1>All Authors</h1>
          <ul className="grid">
            {authors.map((author: any) => (
              <li key={author.id}>
                <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
