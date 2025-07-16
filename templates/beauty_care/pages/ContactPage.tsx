import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";
import { getContactContent } from "@/lib/wordpress";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description: "Contact us",
  };
}

const ContactPage = async () => {
  try {
    const contactContent = await getContactContent();

    if (!contactContent) {
      return (
        <main className="space-y-6">
          <h1>No content available</h1>
          <p>Unable to load contact page content.</p>
        </main>
      );
    }

    return (
      <main>
        
        {/* Contact Info */}
        <section className="bg-background-600 py-16 pt-32 px-4 lg:px-8">
          <AboutUsContact contactContent={contactContent} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching home content:", error);
    return (
      <main className="space-y-6">
        <h1>Error Loading Content</h1>
        <p>There was an error loading the contact page content. Please try again later.</p>
      </main>
    );
  }
};

export default ContactPage;
