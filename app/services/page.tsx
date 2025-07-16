import AboutUsContact from "@/components/about/AboutUsContact";
import ServicesGrid from "@/components/services/ServicesGrid";
import { Button } from "@/components/ui/button";
import { getContactContent, getServicesContent } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ServicesPage = async () => {
  try {
    const servicesContent = await getServicesContent();
    const contactContent = await getContactContent();

    if (!servicesContent) {
      return (
        <main className="space-y-6">
          <h1>No content available</h1>
          <p>Unable to load services page content.</p>
        </main>
      );
    }

    return (
      <main>
        <section className="pt-24 md:pt-32 bg-background-900 pb-16">
          <ServicesGrid servicesContent={servicesContent} />
        </section>
        
        {/* Contact Info */}
        <section className="bg-background-600 py-16 px-4 lg:px-8">
          <AboutUsContact contactContent={contactContent} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching home content:", error);
    return (
      <main className="space-y-6">
        <h1>Error Loading Content</h1>
        <p>There was an error loading the services page content. Please try again later.</p>
      </main>
    );
  }
};

export default ServicesPage;
