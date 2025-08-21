import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";
import AboutUsGallery from "@/templates/barbershop/components/about/AboutUsGallery";
import AboutUsInfo from "@/templates/barbershop/components/about/AboutUsInfo";
import AboutUsMission from "@/templates/barbershop/components/about/AboutUsMission";
import AboutUsValues from "@/templates/barbershop/components/about/AboutUsValues";
import { AboutUsContent, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";

interface Props {
  aboutUsContent: AboutUsContent;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const AboutPage = async ({ aboutUsContent, contactContent, themeOptions }: Props) => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About" }
  ];

  if (!aboutUsContent) {
    return (
      <main className="space-y-6">
        <h1>No content available</h1>
        <p>Unable to load about page content.</p>
      </main>
    );
  }

  return (
    <ScrollAnimations>
      <main>
        {/* About Us Content */}
        <Section className="pt-36 bg-background-600 pb-16">
          <Container className="max-w-7xl mx-auto px-8 xl:px-0">
            <Breadcrumb items={breadcrumbItems} className="py-4 scroll-animate" />
            <AboutUsInfo aboutUsContent={aboutUsContent} />
            {aboutUsContent.gallery.length > 0 && <AboutUsGallery aboutUsContent={aboutUsContent} />}
            <AboutUsMission aboutUsContent={aboutUsContent} />
            <AboutUsValues aboutUsContent={aboutUsContent} />
          </Container>
        </Section>

        {/* Contact Info */}
        <section className="bg-background-900 py-16 px-4 lg:px-16">
          <AboutUsContact />
        </section>
      </main>
    </ScrollAnimations>
  );
};

export default AboutPage;
