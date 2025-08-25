import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";
import ServicesGrid from "@/templates/barbershop/components/services/ServicesGrid";
import { ServicesContent, ContactContent, ContactLocation, SEOLocation, ThemeOptions } from "@/lib/wordpress.d";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";
import { FaMapMarker, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { formatPhoneForDisplay, formatPhoneForTel, getStateFullName, generateNeighborhoodBreadcrumbs, generateGoogleMapsUrl } from "@/lib/utils";

interface Props {
  seoLocationData: SEOLocation;
  mainLocationData: ContactLocation;
  servicesContent: ServicesContent;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const NeighborhoodHubPage = async ({ seoLocationData, mainLocationData, servicesContent, contactContent, themeOptions }: Props) => {
  // Early return if seoLocationData is null
  if (!seoLocationData) {
    return (
      <main className="space-y-6">
        <h1>Neighborhood not found</h1>
        <p>The requested neighborhood could not be found.</p>
      </main>
    );
  }

  const stateSlug = getStateFullName(seoLocationData.address.state);
  const citySlug = seoLocationData.address.city.toLowerCase().replace(/\s+/g, '-');
  const neighborhoodSlug = seoLocationData.address.neighborhood.toLowerCase().replace(/\s+/g, '-');

  if (!servicesContent) {
    return (
      <main className="space-y-6">
        <h1>No content available</h1>
        <p>Unable to load neighborhood hub page content.</p>
      </main>
    );
  }

  return (
    <ScrollAnimations>
      <main>
        {/* Hero Section */}
        <Section className="pt-40 bg-background-900 pb-16">
          <Container className="max-w-7xl mx-auto">
            
            <div className="text-center mb-12 scroll-animate">
              <h1 className="text-4xl md:text-6xl font-heading text-primary font-bold mb-4">
                Professional Services in {seoLocationData.address.neighborhood}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Serving {seoLocationData.address.neighborhood}, {seoLocationData.address.city}, {seoLocationData.address.state} with expert solutions and exceptional service.
              </p>
            </div>

            {/* NAP Information */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 scroll-animate">
              <Link
                href={generateGoogleMapsUrl(seoLocationData.address, seoLocationData.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaMapMarker className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    {seoLocationData.address.street}<br />
                    {seoLocationData.address.city}, {seoLocationData.address.state} {seoLocationData.address.zip_code}
                  </p>
                </div>
              </Link>
              
              <Link
                href={`tel:${formatPhoneForTel(mainLocationData.phone_number || "")}`}
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaPhone className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">
                    {formatPhoneForDisplay(mainLocationData.phone_number || "")}
                  </p>
                </div>
              </Link>
              
              <Link
                href={`mailto:${mainLocationData.email}`}
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaEnvelope className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    {mainLocationData.email}
                  </p>
                </div>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 scroll-animate">
              <Link href={`/contact`}>
                <Button size="lg" className="w-full sm:w-auto rounded-none">
                  Contact Us
                </Button>
              </Link>
              <Link href={`/locations/${stateSlug}/${citySlug}/${neighborhoodSlug}/services`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-none">
                  View Services
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Services Preview */}
        <Section className="bg-background-700 py-16">
          <Container className="max-w-7xl mx-auto">

            
            <ServicesGrid servicesContent={servicesContent} seoLocationData={seoLocationData} mainLocationData={mainLocationData} isNeighborhoodPage={true} />
            
          </Container>
        </Section>
        
        {/* Contact Info */}
        <section className="bg-background-900 py-16 px-4 lg:px-8">
          <AboutUsContact />
        </section>
      </main>
    </ScrollAnimations>
  );
};

export default NeighborhoodHubPage;