import { Container, Section } from "@/components/craft";
import ServiceGallery from "@/templates/barbershop/components/services/ServiceGallery";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactLocation, SEOLocation, ServiceItem, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { generateNeighborhoodBreadcrumbs, getStateFullName } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";
import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";

interface Props {
  seoLocationData: SEOLocation;
  mainLocationData: ContactLocation;
  serviceData: ServiceItem;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const NeighborhoodServiceDetailPage = async ({ seoLocationData, mainLocationData, serviceData, contactContent, themeOptions }: Props) => {
  // Early return if locationData or serviceData is null
  if (!seoLocationData || !serviceData) {
    return (
      <main className="space-y-6">
        <h1>Service not found</h1>
        <p>The requested service could not be found.</p>
      </main>
    );
  }

  // Generate breadcrumbs for neighborhood service detail
  const baseBreadcrumbs = generateNeighborhoodBreadcrumbs(seoLocationData);
  const breadcrumbItems = [
    ...baseBreadcrumbs,
    { 
      label: "Services", 
      href: `/locations/${getStateFullName(seoLocationData.address.state)}/${seoLocationData.address.city.toLowerCase().replace(/\s+/g, '-')}/${seoLocationData.address.neighborhood.toLowerCase().replace(/\s+/g, '-')}/services`
    },
    { label: serviceData.title }
  ];

  return (
    <ScrollAnimations>
      <Section className="pt-36 bg-background-900 pb-16">
        <Container className="max-w-7xl mx-auto px-8 xl:px-0">
          
          <Breadcrumb items={breadcrumbItems} className="py-4 scroll-animate" />
          
          <h1 className="text-4xl md:text-5xl font-heading text-primary text-center leading-[0.9] md:text-left font-bold scroll-animate">
            {serviceData.title} in {seoLocationData.address.neighborhood}
          </h1>
          <p className="text-muted-foreground/80 text-center mt-1 md:text-left w-full scroll-animate">
            {serviceData.description}
          </p>
          
          {serviceData.featured_image && (
            <div className="py-4 w-full flex justify-center scroll-animate">
              <Image
                src={serviceData.featured_image.url}
                alt={serviceData.featured_image.alt || serviceData.title}
                className="max-w-full w-full aspect-video object-cover max-h-[600px] h-auto shadow-lg"
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
      <section className="bg-background-600 py-16 px-4 lg:px-8">
        <AboutUsContact />
      </section>
    </ScrollAnimations>
  );
};

export default NeighborhoodServiceDetailPage;