import { Container, Section } from "@/components/craft";
import ServiceGallery from "@/templates/beauty_care/components/services/ServiceGallery";
import ScrollAnimations from "@/templates/beauty_care/components/layout/ScrollAnimations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactLocation, ServiceItem, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { generateLocationSlug } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";

interface Props {
  locationData: ContactLocation;
  serviceData: ServiceItem;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const LocationServiceDetailPage = async ({ locationData, serviceData, contactContent, themeOptions }: Props) => {
  const locationSlug = generateLocationSlug(locationData.address.city, locationData.address.state);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: locationData.address.city, href: `/${locationSlug}` },
    { label: "Services", href: `/${locationSlug}/services` },
    { label: serviceData.title }
  ];

  return (
    <ScrollAnimations>
      <Section className="pt-36 bg-background-950">
        <Container className="max-w-7xl mx-auto pb-16 px-8 xl:px-0">
          
          <Breadcrumb items={breadcrumbItems} className="py-4 scroll-animate" />
          
          <h1 className="text-4xl md:text-5xl font-heading text-primary text-center leading-[0.9] md:text-left font-bold scroll-animate">
            {serviceData.title} in {locationData.address.city}
          </h1>
          <p className="text-muted-foreground/80 text-center mt-2 md:text-left w-full scroll-animate">
            {serviceData.description}
          </p>
          
          {serviceData.featured_image && (
            <div className="py-4 w-full flex justify-center scroll-animate">
              <Image
                src={serviceData.featured_image.url}
                alt={serviceData.featured_image.alt || serviceData.title}
                className="max-w-full w-full aspect-video object-cover max-h-[500px] h-auto rounded-lg shadow-lg"
                width={1000}
                height={1000}
              />
            </div>
          )}
          
          {serviceData.service_page_content && (
            <div className="mt-2 w-full max-w-none prose-strong:text-text prose prose-h1:text-4xl prose-headings:text-text prose-p:text-text prose-li:text-text prose-headings:font-heading prose-headings:text-3xl prose-h1:font-heading prose-h1:text-primary prose-h1:leading-[0.9] prose-h1:font-bold scroll-animate" dangerouslySetInnerHTML={{ __html: serviceData.service_page_content }} />
          )}
          {serviceData.gallery && serviceData.gallery.length > 0 && (
            <ServiceGallery service={serviceData} />
          )}
        </Container>
      </Section>
      
      {/* Contact Info */}
      <section className="bg-background-900 py-16 px-4 lg:px-8">
        <AboutUsContact contactContent={contactContent} themeOptions={themeOptions} />
      </section>
    </ScrollAnimations>
  );
};

export default LocationServiceDetailPage; 