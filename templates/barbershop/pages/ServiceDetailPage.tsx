import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";
import { ContactContent, ThemeOptions, ServiceItem } from "@/lib/wordpress.d";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import Image from "next/image";
import ServiceGallery from "@/templates/barbershop/components/services/ServiceGallery";

interface Props {
  serviceData: ServiceItem;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const ServiceDetailPage = async ({ serviceData, contactContent, themeOptions }: Props) => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: serviceData.title },
  ];

  return (
    <ScrollAnimations>
      <Section className="pt-36 bg-background-900 pb-16">
        <Container className="max-w-7xl mx-auto px-8 xl:px-0">
          <Breadcrumb
            items={breadcrumbItems}
            className="py-4 scroll-animate"
          />

          <div className="flex gap-24">
            <div className="w-2/3">
              <h1 className="text-4xl md:text-5xl font-heading text-primary text-center leading-[0.9] md:text-left font-bold scroll-animate">
                {serviceData.title}
              </h1>
              <p className="text-muted-foreground/80 text-center mt-1 md:text-left w-full scroll-animate">
                {serviceData.description}
              </p>
            </div>

            {serviceData.featured_image && (
              <div className="py-4 w-1/3 flex justify-center scroll-animate">
                <Image
                  src={serviceData.featured_image.url}
                  alt={serviceData.featured_image.alt || serviceData.title}
                  className="max-w-full w-full aspect-video object-cover object-top h-auto shadow-lg"
                  width={1000}
                  height={1000}
                />
              </div>
            )}
          </div>

          {serviceData.service_page_content && (
            <div
              className="prose prose-lg max-w-none mt-8 scroll-animate"
              dangerouslySetInnerHTML={{ __html: serviceData.service_page_content }}
            />
          )}
          {serviceData.gallery && serviceData.gallery.length > 0 && (
            <div className="scroll-animate">
              <ServiceGallery service={serviceData} />
            </div>
          )}
        </Container>
      </Section>

      {/* Contact Info */}
      <section className="bg-background-600 py-16 px-4 lg:px-8">
        <AboutUsContact />
      </section>
    </ScrollAnimations>
  );
};

export default ServiceDetailPage;
