import { ContactContent, ContactLocation } from "@/lib/wordpress.d";
import { generateLocationSlug } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { FaEnvelope, FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaMapMarker, FaPhone, FaTwitter } from "react-icons/fa";
import Location from "@/templates/beauty_care/components/homepage/Location";
import ScrollAnimations from "@/templates/beauty_care/components/layout/ScrollAnimations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import ContactForm from "@/components/ContactForm";

interface Props {
  locationData: ContactLocation;
  contactContent: ContactContent;
}

const LocationContactPage = async ({ locationData, contactContent }: Props) => {
  const locationSlug = generateLocationSlug(locationData.address.city, locationData.address.state);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: locationData.address.city, href: `/${locationSlug}` },
    { label: "Contact" }
  ];

  if (!contactContent) {
    return (
      <main className="space-y-6">
        <h1>No content available</h1>
        <p>Unable to load contact page content.</p>
      </main>
    );
  }

  return (
    <ScrollAnimations>
      <main>
        {/* Contact Info */}
        <Section className="bg-background-950 pb-8 pt-36 px-4 lg:px-8">
          <Container className="max-w-7xl mx-auto px-8 lg:px-0">
            <Breadcrumb items={breadcrumbItems} className="py-4 scroll-animate" />
            
            <span className="text-primary font-medium text-3xl text-center md:text-left mb-2 font-heading scroll-animate">
              {contactContent.page_info?.subtitle || "Get in Touch"}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left font-bold scroll-animate">
              {contactContent.page_info?.title || "Contact Us"} in {locationData.address.city}
            </h1>
            <p className="text-text text-center text-sm mt-2 md:text-left w-full scroll-animate">
              {contactContent.page_info?.description || "We would love to hear from you!"}
            </p>
            
            {/* Show specific location */}
            <div className="pt-2 flex flex-col lg:flex-row md:gap-12">
              <div className="lg:w-8/12 pt-4 md:py-8 rounded-lg scroll-animate-left">
                <Location contactContent={contactContent} />
              </div>
              <div className="flex flex-col w-full lg:w-4/12 justify-between scroll-animate-right">
                <div className="pt-4 md:py-8 rounded-lg">
                  <h2 className="text-primary font-medium text-xl text-center md:text-left  font-heading scroll-animate">
                    {locationData.name || "Contact Info"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col mt-2 group scroll-animate" style={{ animationDelay: "0.1s" }}>
                      <div className="flex items-center gap-2 text-text group-hover:text-primary text-xl transition-all duration-300 ease-in-out">
                        <FaMapMarker className="w-4 h-4 -mt-1" />
                        <h3 className="font-medium  font-heading">Address</h3>
                      </div>
                      <p className="text-text">
                        {locationData.address.full_address || 
                         `${locationData.address.street}, ${locationData.address.city}, ${locationData.address.state} ${locationData.address.zip_code}`}
                      </p>
                    </div>
                    {locationData.phone_number && (
                      <div className="flex flex-col mt-2 group scroll-animate" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center gap-1 text-text group-hover:text-primary text-xl transition-all duration-300 ease-in-out">
                          <FaPhone className="w-4 h-4 -mt-1 mr-1" />
                          <h3 className="font-medium  font-heading">Phone</h3>
                        </div>
                        <Link href={`tel:${locationData.phone_number}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                          {locationData.phone_number}
                        </Link>
                      </div>
                    )}
                    {locationData.email && (
                      <div className="flex flex-col mt-2 group scroll-animate" style={{ animationDelay: "0.3s" }}>
                        <div className="flex items-center gap-2 text-text group-hover:text-primary text-xl transition-all duration-300 ease-in-out">
                          <FaEnvelope className="w-4 h-4 -mt-1" />
                          <h3 className="font-medium  font-heading">Email</h3>
                        </div>
                        <Link href={`mailto:${locationData.email}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                          {locationData.email}
                        </Link>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-2 scroll-animate" style={{ animationDelay: "0.4s" }}>
                      {Object.entries(locationData.social_media)
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
                              className="flex items-center gap-2 text-text hover:text-primary text-2xl transition-all capitalize duration-300 ease-in-out"
                            >
                              {socialIcons[key as keyof typeof socialIcons]}
                              <Link
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium  font-heading"
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
          </Container>
        </Section>
        
        {/* Contact Form Section */}
        <Section className="!bg-background-600 py-16 px-4 lg:px-8">
          <Container className="max-w-7xl mx-auto">
            <ContactForm />
          </Container>
        </Section>
      </main>
    </ScrollAnimations>
  );
};

export default LocationContactPage; 