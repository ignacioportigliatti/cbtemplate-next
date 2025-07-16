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
import Hero from "@/templates/beauty_care/components/homepage/Hero";
import AboutUs from "@/templates/beauty_care/components/homepage/AboutUs";
import PopularServices from "@/templates/beauty_care/components/homepage/PopularServices";
import FeaturedBlog from "@/templates/beauty_care/components/homepage/FeaturedBlog";
import FAQ from "@/templates/beauty_care/components/homepage/FAQ";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";
import Location from "@/templates/beauty_care/components/homepage/Location";
import Reviews from "@/templates/beauty_care/components/homepage/Reviews";
import Team from "@/templates/beauty_care/components/homepage/Team";
import AboutUsContact from "../components/about/AboutUsContact";
import HeroCarousel from "../components/homepage/HeroCarousel";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const themeOptions = await getThemeOptions();

    const title = themeOptions.general.site_name || "Barber Shop";
    const description =
      themeOptions.general.site_description ||
      "Barber Shop Cuts is a California based barber shop that offers a variety of services to its customers.";

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
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(
              `Home | ${title}`,
            )}&description=${encodeURIComponent(description)}`,
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
        images: [
          `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(
            `Home | ${title}`,
          )}&description=${encodeURIComponent(description)}`,
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Home",
      description:
        "Barber Shop Cuts is a California based barber shop that offers a variety of services to its customers.",
      metadataBase: new URL(siteConfig.site_domain),
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
    ] = await Promise.all([
      getHomeContent(),
      getServicesContent(),
      getAllPosts(),
      getReviewsContent(),
      getContactContent(),
      getTeamContent(),
      getAboutUsContent(),
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
      <main>
        {/* Hero Section */}
        <section>
          <Hero homeContent={homeContent} />
        </section>

        {/* Service & Location Combined Section */}
        <section className="bg-background-900 px-8 lg:px-16 text-foreground py-16 !pb-24 md:py-16">
          <div className="max-w-7xl mx-auto flex">
            <div className="flex flex-col lg:flex-row items-stretch justify-between md:gap-12">
              {/* Left Side - About Us */}
              <div className="lg:w-1/2 py-4 md:py-8 rounded-lg">
                <AboutUs aboutUsContent={aboutUsContent} />
              </div>

              {/* Right Side - Image Carousel */}
              <div className="lg:w-1/2 relative h-[480px]">
                <div className="overflow-hidden  rounded-lg">
                  <HeroCarousel
                    gallery={aboutUsContent.gallery}
                    imageClassName="!h-[480px]"
                  />
                </div>
                <Image
                  src="/flowers2.webp"
                  alt="Hero Decorative"
                  width={300}
                  height={100}
                  className="pointer-events-none absolute lg:w-80 w-52 lg:-bottom-16 lg:-right-20 -right-8 -bottom-8 -hue-rotate-60 saturate-50 brightness-110"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services Section */}
        <section>
          <PopularServices
            homeContent={homeContent}
            servicesContent={servicesContent}
          />
        </section>

        {/* Team Section */}
        <section>
          <Team teamContent={teamContent} />
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

        {/* Contact Section */}
        <section className="bg-background-900 px-8 lg:px-16 text-foreground py-16 md:py-16">
          <AboutUsContact contactContent={contactContent} />
        </section>

        {/* Blog Section */}
        <section>
          <FeaturedBlog
            homeContent={homeContent}
            blogContent={blogContent}
          />
        </section>
      </main>
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
