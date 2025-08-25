import { Container, Section } from "@/components/craft";
import ServiceGallery from "@/templates/beauty_care/components/services/ServiceGallery";
import ScrollAnimations from "@/templates/beauty_care/components/layout/ScrollAnimations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactLocation, SEOLocation, ServiceItem, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { generateNeighborhoodBreadcrumbs, getStateFullName } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";

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
      <Section className="pt-36 bg-background-950">
        <Container className="max-w-7xl mx-auto pb-16 px-8 xl:px-0">
          
          <Breadcrumb items={breadcrumbItems} className="py-4 scroll-animate" />
          
          {/* Main Content with Featured Image Side by Side */}
          <div className="flex gap-24 mb-12">
            {/* Content Column */}
            <div className="w-2/3 scroll-animate">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-heading text-primary text-center leading-[0.9] md:text-left font-bold">
                  {serviceData.title}
                </h1>
                <p className="text-muted-foreground/80 text-center mt-2 md:text-left w-full">
                  {serviceData.description}
                </p>
              </div>
              
              {serviceData.service_page_content && (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: serviceData.service_page_content }}
                />
              )}
            </div>
            
            {/* Featured Image Column */}
            {serviceData.featured_image && (
              <div className="w-1/3 scroll-animate">
                <div className="sticky top-24 h-full">
                  <Image
                    src={serviceData.featured_image.url}
                    alt={serviceData.featured_image.alt || serviceData.title}
                    className="w-full h-full object-cover object-center rounded-lg shadow-lg"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Gallery Section - Full Width */}
          {serviceData.gallery && serviceData.gallery.length > 0 && (
            <div className="scroll-animate">
              <ServiceGallery service={serviceData} />
            </div>
          )}
        </Container>
      </Section>
      
      {/* Contact Info */}
      <section className="bg-background-900 py-16 px-4 lg:px-8">
        <AboutUsContact />
      </section>
    </ScrollAnimations>
  );
};

export default NeighborhoodServiceDetailPage;