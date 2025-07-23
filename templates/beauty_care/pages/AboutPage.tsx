import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";
import AboutUsGallery from "@/templates/beauty_care/components/about/AboutUsGallery";
import AboutUsInfo from "@/templates/beauty_care/components/about/AboutUsInfo";
import AboutUsMission from "@/templates/beauty_care/components/about/AboutUsMission";
import AboutUsValues from "@/templates/beauty_care/components/about/AboutUsValues";
import { getAboutUsContent, getContactContent } from "@/lib/wordpress";
import { Metadata } from "next";
import Image from "next/image";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us",
    description: "Learn more about our company",
  };
}

const AboutPage = async () => {
  try {
    const aboutUsContent = await getAboutUsContent();
    const contactContent = await getContactContent();

    if (!aboutUsContent) {
      return (
        <main className="space-y-6">
          <h1>No content available</h1>
          <p>Unable to load about page content.</p>
        </main>
      );
    }

    return (
      <main>
        {/* About Us Content */}
        <section className="pt-24 md:pt-32 bg-background-950 pb-16">
          <div className="max-w-7xl flex flex-col lg:flex-row lg:gap-12 mx-auto px-8 xl:px-0">
            <div
              className={cn(
                "w-full",
                aboutUsContent.gallery && aboutUsContent.gallery.length > 0
                  ? "lg:w-7/12"
                  : "lg:w-full",
              )}
            >
              <AboutUsInfo aboutUsContent={aboutUsContent} />
              <AboutUsMission aboutUsContent={aboutUsContent} />
            </div>
            {aboutUsContent.gallery && aboutUsContent.gallery.length > 0 && (
              <div className="w-full mb-8 lg:mb-0 lg:w-5/12 lg:flex lg:items-stretch">
                <Image
                  src={aboutUsContent.gallery[0].url}
                  alt={aboutUsContent.gallery[0].alt}
                  width={600}
                  height={600}
                  className="w-full object-cover rounded-lg lg:h-full"
                />
              </div>
            )}
          </div>
          <div className="max-w-7xl mx-auto px-8 xl:px-0 mt-12">
            <AboutUsValues aboutUsContent={aboutUsContent} />
            {aboutUsContent.gallery && aboutUsContent.gallery.length > 0 && (
              <AboutUsGallery aboutUsContent={aboutUsContent} />
            )}
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-background-900 py-16 px-4 lg:px-16">
          <AboutUsContact contactContent={contactContent} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching home content:", error);
    return (
      <main className="space-y-6">
        <h1>Error Loading Content</h1>
        <p>There was an error loading the about page content. Please try again later.</p>
      </main>
    );
  }
};

export default AboutPage;
