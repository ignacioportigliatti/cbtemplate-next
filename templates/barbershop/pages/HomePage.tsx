// Craft Imports
import { Section } from "@/components/craft";

import {
  getAboutUsContent,
  getAllPosts,
  getContactContent,
  getHomeContent,
  getReviewsContent,
  getServicesContent,
  getTeamContent,
  getThemeOptions,
} from "@/lib/wordpress";
import Hero from "@/templates/barbershop/components/homepage/Hero";
import AboutUs from "@/templates/barbershop/components/homepage/AboutUs";
import PopularServices from "@/templates/barbershop/components/homepage/PopularServices";
import FeaturedBlog from "@/templates/barbershop/components/homepage/FeaturedBlog";
import FAQ from "@/templates/barbershop/components/homepage/FAQ";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";
import Location from "@/templates/barbershop/components/homepage/Location";
import Reviews from "@/templates/barbershop/components/homepage/Reviews";
import Team from "@/templates/barbershop/components/homepage/Team";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();
    
    const title = siteConfig.site_name;
    const description = siteConfig.site_description;
    const logoUrl = themeOptions.general.site_logo?.url;

    return {
      title: `Home | ${title}`,
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        title: `Home | ${title}`,
        description: description,
        type: "website",
        url: siteConfig.site_domain,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Home | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Home | ${title}`,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(`Home | ${title}`)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Home",
      description: "Professional services",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      alternates: {
        canonical: "/",
      },
    };
  }
}

export default function Home() {
  return (
    <Section>
      <HomePage />
    </Section>
  );
}
const HomePage = async () => {
  try {
    const [
      homeContent,
      servicesContent,
      blogContent,
      reviewsContent,
      contactContent,
      teamContent,
      aboutUsContent,
      themeOptions,
    ] = await Promise.all([
      getHomeContent(),
      getServicesContent(),
      getAllPosts(),
      getReviewsContent(),
      getContactContent(),
      getTeamContent(),
      getAboutUsContent(),
      getThemeOptions(),
    ]);

    if (!homeContent) {
      return (
        <main className="space-y-6">
          <h1>No content available</h1>
          <p>Unable to load home page content.</p>
        </main>
      );
    }

    return (
      <ScrollAnimations>
        <main>
          {/* Hero Section - Main H1 */}
          <section>
            <Hero homeContent={homeContent} themeOptions={themeOptions} contactContent={contactContent} />
          </section>

          {/* About Us & Location Section */}
          <section className="bg-background-900 px-8 lg:px-16 text-foreground py-8 md:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-stretch justify-between md:gap-12">
                {/* Left Side - About Us */}
                <div className="lg:w-1/2 py-4 md:py-8 rounded-lg scroll-animate-left">
                  <AboutUs aboutUsContent={aboutUsContent} />
                </div>

                {/* Right Side - Location */}
                <div className="lg:w-1/2 rounded-lg scroll-animate-right">
                  <Location contactContent={contactContent} />
                </div>
              </div>
            </div>
          </section>

          {/* Popular Services Section */}
          <section>
            <PopularServices
              homeContent={homeContent}
              servicesContent={servicesContent}
              contactContent={contactContent}
              themeOptions={themeOptions}
            />
          </section>

          {/* Team Section */}
          <section>
            <Team
              teamContent={teamContent}
            />
          </section>

          {/* Reviews Section */}
          <section>
            <Reviews
              homeContent={homeContent}
              reviewsContent={reviewsContent}
            />
          </section>

          {/* FAQ Section */}
          <section>
            <FAQ homeContent={homeContent} />
          </section>

          {/* Blog Section */}
          <section>
            <FeaturedBlog
              homeContent={homeContent}
              blogContent={blogContent}
            />
          </section>
        </main>
      </ScrollAnimations>
    );
  } catch (error) {
    console.error("Error fetching home content:", error);
    return (
      <main className="space-y-6">
        <h1>Error Loading Content</h1>
        <p>There was an error loading the home page content. Please try again later.</p>
      </main>
    );
  }
};

