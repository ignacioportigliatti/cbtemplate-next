import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";
import ServicesGrid from "@/templates/barbershop/components/services/ServicesGrid";
import { ServicesContent, ContactContent, ContactLocation, ThemeOptions } from "@/lib/wordpress.d";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";
import { FaMapMarker, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { getStateFullName } from "@/lib/utils";

interface Props {
  locationData: ContactLocation;
  servicesContent: ServicesContent;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const LocationHubPage = async ({ locationData, servicesContent, contactContent, themeOptions }: Props) => {
  // Early return if locationData is null
  if (!locationData) {
    return (
      <main className="space-y-6">
        <h1>Location not found</h1>
        <p>The requested location could not be found.</p>
      </main>
    );
  }

  const stateSlug = getStateFullName(locationData.address.state);
  const citySlug = locationData.address.city.toLowerCase().replace(/\s+/g, '-');

  // Generate Google Maps URL for address
  const generateGoogleMapsUrl = () => {
    const address = locationData.address.full_address || 
      `${locationData.address.street}, ${locationData.address.city}, ${locationData.address.state} ${locationData.address.zip_code}`;
    
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  };


  if (!servicesContent) {
    return (
      <main className="space-y-6">
        <h1>No content available</h1>
        <p>Unable to load location hub page content.</p>
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
                Professional Services in {locationData.address.city}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Serving {locationData.address.city}, {locationData.address.state} with expert solutions and exceptional service.
              </p>
            </div>

            {/* NAP Information */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 scroll-animate">
              <Link
                href={generateGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaMapMarker className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    {locationData.address.street}<br />
                    {locationData.address.city}, {locationData.address.state} {locationData.address.zip_code}
                  </p>
                </div>
              </Link>
              
              <Link
                href={`tel:${locationData.phone_number}`}
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaPhone className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">
                    {locationData.phone_number}
                  </p>
                </div>
              </Link>
              
              <Link
                href={`mailto:${locationData.email}`}
                className="block hover:text-primary transition-colors"
              >
                <div className="text-center p-6 border border-border hover:bg-background-700 transition-all duration-300 ease-in-out h-full min-h-[200px] flex flex-col justify-center">
                  <FaEnvelope className="text-primary text-3xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    {locationData.email}
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
              <Link href={`/locations/${stateSlug}/${citySlug}/services`}>
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
            <div className="text-center mb-12 scroll-animate">
              <h2 className="text-3xl md:text-4xl font-heading text-text font-bold mb-4">
                Our Services in {locationData.address.city}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer comprehensive professional services tailored to meet your needs in {locationData.address.city}, {locationData.address.state}.
              </p>
            </div>
            
            <ServicesGrid servicesContent={servicesContent} locationData={locationData} />
            
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

export default LocationHubPage;
