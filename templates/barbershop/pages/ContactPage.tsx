import { ContactContent, ContactLocation } from "@/lib/wordpress.d";
import { generateLocationSlug, formatPhoneForTel, formatPhoneForDisplay, generateGoogleMapsUrl } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { FaEnvelope, FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaMapMarker, FaPhone, FaTwitter } from "react-icons/fa";
import Location from "@/templates/barbershop/components/homepage/Location";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container, Section } from "@/components/craft";
import ContactForm from "@/components/ContactForm";

interface Props {
  locationData: ContactLocation;
  contactContent: ContactContent;
}

const ContactPage = async ({ contactContent }: Props) => {
  const mainLocation = contactContent.locations[0];
  const locationData = mainLocation as ContactLocation;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
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
    <main>
      {/* Contact Info */}
      <Section className="bg-background-900 py-16 pt-36 px-4 lg:px-8">
        <Container className="max-w-7xl mx-auto px-8 lg:px-0">
          <Breadcrumb items={breadcrumbItems} className="mb-2" />
          
          <span className="text-primary font-medium text-2xl text-center md:text-left mb-2 uppercase font-heading block">
            {contactContent.page_info?.subtitle || "Get in Touch"}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left font-bold">
            {contactContent.page_info?.title || "Contact Us"} in {locationData.address.city}
          </h1>
          <p className="text-text text-center text-sm md:text-left w-full">
            {contactContent.page_info?.description || "We would love to hear from you!"}
          </p>
          
          {/* Show specific location */}
          <div className="pt-2 flex flex-col lg:flex-row md:gap-12">
            <div className="lg:w-8/12 pt-4 md:py-8 rounded-lg">
              <Location contactContent={contactContent} mapHeight="480px" />
            </div>
            <div className="flex flex-col w-full lg:w-4/12 justify-between">
              <div className="pt-4 md:py-8 rounded-lg">
                <h2 className="text-primary font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading">
                  {locationData.name || "Contact Info"}
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col mt-2 group">
                    <Link 
                      href={generateGoogleMapsUrl(locationData.address, locationData.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-primary transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                        <FaMapMarker className="w-4 h-4 -mt-1" />
                        <h3 className="font-medium tracking-[0.2em] uppercase font-heading">Address</h3>
                      </div>
                      <p className="text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                        {locationData.address.full_address || 
                         `${locationData.address.street}, ${locationData.address.city}, ${locationData.address.state} ${locationData.address.zip_code}`}
                      </p>
                    </Link>
                  </div>
                  {locationData.phone_number && (
                    <div className="flex flex-col mt-2 group">
                      <Link href={`tel:${formatPhoneForTel(locationData.phone_number)}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                      <div className="flex items-center gap-1 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                        <FaPhone className="w-4 h-4 -mt-1 mr-1" />
                        <h3 className="font-medium tracking-[0.2em] uppercase font-heading pointer-events-none">Phone</h3>
                      </div>
                        {formatPhoneForDisplay(locationData.phone_number)}
                      </Link>
                    </div>
                  )}
                  {locationData.email && (
                    <div className="flex flex-col mt-2 group">
                      <Link href={`mailto:${locationData.email}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                      <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                        <FaEnvelope className="w-4 h-4 -mt-1" />
                        <h3 className="font-medium tracking-[0.2em] uppercase font-heading pointer-events-none">Email</h3>
                      </div>
                        {locationData.email}
                      </Link>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2">
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

                        const isSocialMedia = key === "facebook" || key === "instagram" || key === "twitter" || key === "linkedin" || key === "google";

                        return (
                          isSocialMedia && (
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
                        ))
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Contact Form Section */}
      <Section className="bg-background-800 py-16 px-4 lg:px-8">
        <Container className="max-w-7xl mx-auto">
          <ContactForm />
        </Container>
      </Section>
    </main>
  );
};

export default ContactPage; 