import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
  getAllPosts,
  getThemeOptions,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ScrollAnimations from "@/templates/beauty_care/components/layout/ScrollAnimations";

import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Image from "next/image";

import type { Metadata } from "next";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();

    if (!post) {
      return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", post.title.rendered);
    // Strip HTML tags for description
    const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
    ogUrl.searchParams.append("description", description);
    
    const logoUrl = themeOptions.general.site_logo?.url;
    if (logoUrl) {
      ogUrl.searchParams.append("logo", logoUrl);
    }

    return {
      title: post.title.rendered,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      openGraph: {
        title: post.title.rendered,
        description: description,
        type: "article",
        url: `${siteConfig.site_domain}/blog/${post.slug}`,
        siteName: siteConfig.site_name,
        images: [
          {
            url: ogUrl.toString(),
            width: 1200,
            height: 630,
            alt: post.title.rendered,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title.rendered,
        description: description,
        images: [ogUrl.toString()],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Blog Post",
      description: "Blog post",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);
  
  // Get all posts for related posts section
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  // Get featured media for related posts
  const relatedPostsWithMedia = await Promise.all(
    relatedPosts.map(async (relatedPost) => {
      const featuredMedia = relatedPost.featured_media
        ? await getFeaturedMediaById(relatedPost.featured_media)
        : null;
      return { ...relatedPost, featuredMedia };
    })
  );

  return (
    <ScrollAnimations>
      <Section className="mt-32 pb-16 max-w-7xl mx-auto">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Article - 2/3 width */}
            <div className="lg:w-2/3">
              <Prose className="!max-w-none !w-full scroll-animate">
                <h1>
                  <Balancer>
                    <span
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    ></span>
                  </Balancer>
                </h1>
                <div className="flex justify-between items-center gap-4 text-sm mb-4 scroll-animate">
                  <p>
                    Published {date} by{" "}
                    {author.name && (
                      <span>
                        <a href={`/blog/?author=${author.id}`}>{author.name}</a>{" "}
                      </span>
                    )}
                  </p>

                  <Link
                    href={`/blog/?category=${category.id}`}
                    className={cn(
                      badgeVariants({ variant: "outline" }),
                      "!no-underline"
                    )}
                  >
                    {category.name}
                  </Link>
                </div>
                {featuredMedia?.source_url && (
                  <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25 scroll-animate">
                    {/* eslint-disable-next-line */}
                    <img
                      className="w-full h-full object-cover"
                      src={featuredMedia.source_url}
                      alt={post.title.rendered}
                    />
                  </div>
                )}
              </Prose>

              <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} className="!max-w-none !w-full scroll-animate" />
            </div>

            {/* Related Posts Sidebar - 1/3 width */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <h3 className="text-2xl font-heading text-text font-bold mb-6 scroll-animate">
                  Related Posts
                </h3>
                <div className="space-y-6">
                  {relatedPostsWithMedia.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group scroll-animate"
                      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                    >
                      <div className="bg-background-600 border border-border/50 hover:border-border/80 transition-all duration-300 p-4 rounded-lg">
                        {relatedPost.featuredMedia?.source_url && (
                          <div className="mb-3 h-32 overflow-hidden rounded-md">
                            <Image
                              src={relatedPost.featuredMedia.source_url}
                              alt={relatedPost.title.rendered}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h4 className="text-lg font-heading text-text font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                          {relatedPost.title.rendered}
                        </h4>
                        <p className="text-muted-foreground/80 text-sm line-clamp-3">
                          {relatedPost.excerpt.rendered.replace(/<[^>]*>/g, "").trim()}
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground/60">
                          {new Date(relatedPost.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </ScrollAnimations>
  );
}
