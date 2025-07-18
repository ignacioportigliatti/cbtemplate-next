import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";
import AboutUsGallery from "@/templates/beauty_care/components/about/AboutUsGallery";
import AboutUsInfo from "@/templates/beauty_care/components/about/AboutUsInfo";
import AboutUsMission from "@/templates/beauty_care/components/about/AboutUsMission";
import AboutUsValues from "@/templates/beauty_care/components/about/AboutUsValues";
import { getAboutUsContent, getContactContent } from "@/lib/wordpress";
import { Metadata } from "next";

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
          <div className="max-w-7xl mx-auto px-8 xl:px-0">
            <AboutUsInfo aboutUsContent={aboutUsContent} />
            <AboutUsMission aboutUsContent={aboutUsContent} />
            <AboutUsValues aboutUsContent={aboutUsContent} />
            <AboutUsGallery aboutUsContent={aboutUsContent} />
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
