import AboutUsContact from "@/templates/barbershop/components/about/AboutUsContact";
import ServicesGrid from "@/templates/barbershop/components/services/ServicesGrid";
import { ServicesContent, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollAnimations from "@/templates/barbershop/components/layout/ScrollAnimations";

interface Props {
  servicesContent: ServicesContent;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const ServicesPage = async ({ servicesContent, contactContent, themeOptions }: Props) => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services" }
  ];

  if (!servicesContent) {
    return (
      <main className="space-y-6">
        <h1>No content available</h1>
        <p>Unable to load services page content.</p>
      </main>
    );
  }

  return (
    <ScrollAnimations>
      <main>
        <Section className="pt-36 bg-background-900 pb-16">
          <Container className="max-w-7xl mx-auto">
            <Breadcrumb items={breadcrumbItems} className="scroll-animate py-4" />
            <ServicesGrid servicesContent={servicesContent} />
          </Container>
        </Section>
        
        {/* Contact Info */}
        <section className="bg-background-600 py-16 px-4 lg:px-8">
          <AboutUsContact />
        </section>
      </main>
    </ScrollAnimations>
  );
};

export default ServicesPage;
