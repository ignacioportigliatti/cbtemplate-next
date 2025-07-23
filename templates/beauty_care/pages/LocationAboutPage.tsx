import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";
import AboutUsGallery from "@/templates/beauty_care/components/about/AboutUsGallery";
import AboutUsInfo from "@/templates/beauty_care/components/about/AboutUsInfo";
import AboutUsMission from "@/templates/beauty_care/components/about/AboutUsMission";
import AboutUsValues from "@/templates/beauty_care/components/about/AboutUsValues";
import { AboutUsContent, ContactContent, ContactLocation } from "@/lib/wordpress.d";
import { generateLocationSlug } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";

interface Props {
  locationData: ContactLocation;
  aboutUsContent: AboutUsContent;
  contactContent: ContactContent;
}

const LocationAboutPage = async ({ locationData, aboutUsContent, contactContent }: Props) => {
  const locationSlug = generateLocationSlug(locationData.address.city, locationData.address.state);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: locationData.address.city, href: `/${locationSlug}` },
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
    <main>
      {/* About Us Content */}
      <Section className="pt-24 md:pt-32 bg-background-950 pb-16">
        <Container className="max-w-7xl mx-auto px-8 xl:px-0">
          <Breadcrumb items={breadcrumbItems} className="mb-8" />
          <AboutUsInfo aboutUsContent={aboutUsContent} />
          {aboutUsContent.gallery.length > 0 && <AboutUsGallery aboutUsContent={aboutUsContent} />}
          <AboutUsMission aboutUsContent={aboutUsContent} />
          <AboutUsValues aboutUsContent={aboutUsContent} />
        </Container>
      </Section>

      {/* Contact Info */}
      <section className="bg-background-900 py-16 px-4 lg:px-16">
        <AboutUsContact contactContent={contactContent} />
      </section>
    </main>
  );
};

export default LocationAboutPage; 