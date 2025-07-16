import { getContactContent } from "@/lib/wordpress";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FaEnvelope, FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaMapMarker, FaPhone, FaTwitter } from "react-icons/fa";
import Location from "@/templates/barbershop/components/homepage/Location";

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
        <div className="max-w-7xl mx-auto px-8 lg:px-0">
      <h2 className="text-primary font-medium text-2xl text-center md:text-left mb-2 uppercase font-heading">
        {contactContent.page_info.subtitle}
      </h2>
      <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left font-bold">
        {contactContent.page_info.title}
      </h1>
      <p className="text-text text-center text-sm md:text-left w-full">
        {contactContent.page_info.description}
      </p>
      <div className="pt-2 flex flex-col lg:flex-row md:gap-12">
        <div className="lg:w-8/12 pt-4 md:py-8 rounded-lg">
          <Location contactContent={contactContent} mapHeight="480px" />
        </div>
        <div className="flex flex-col w-full lg:w-4/12 justify-between">
          <div className=" pt-4 md:py-8 rounded-lg">
            <h3 className="text-primary font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading">
              Contact Info
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaMapMarker className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Address</h4>
                </div>
                <p className="text-text">{contactContent.location.address}</p>
              </div>
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-1 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaPhone className="w-4 h-4 -mt-1 mr-1" />
                  <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Phone</h4>
                </div>
                <p className="text-text">{contactContent.location.phone_number}</p>
              </div>
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaEnvelope className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Email</h4>
                </div>
                <p className="text-text">{contactContent.location.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(contactContent.location.social_media)
                  .filter(([key, value]) => value && value.trim() !== "")
                  .map(([key, value]) => {
                    const socialIcons = {
                      facebook: <FaFacebook className="w-4 h-4 -mt-1" />,
                      instagram: <FaInstagram className="w-4 h-4 -mt-1" />,
                      twitter: <FaTwitter className="w-4 h-4 -mt-1" />,
                      linkedin: <FaLinkedin className="w-4 h-4 -mt-1" />,
                      google: <FaGoogle className="w-4 h-4 -mt-1" />,
                    };

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-text hover:text-primary transition-all duration-300 ease-in-out"
                      >
                        {socialIcons[key as keyof typeof socialIcons]}
                        <Link
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium tracking-[0.2em] uppercase font-heading"
                        >
                          {key}
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
