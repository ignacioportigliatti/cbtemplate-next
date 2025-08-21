import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import React from "react";
import Location from "../homepage/Location";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaMapMarker,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";
import { getContactContent, getThemeOptions } from "@/lib/wordpress";
import { getPhysicalLocations, getMainPhysicalLocation, generateLocationSlug } from "@/lib/utils";

const AboutUsContact = async () => {
  const contactContent = await getContactContent();
  const themeOptions = await getThemeOptions();
  // Determine CTA type and button text
  const ctaType = themeOptions?.general?.cta_type || "default_form";
  const buttonText = ctaType === "chilled_butter_widget" ? "Book Now" : "Get Started";
  // Use all physical locations
  const physicalLocations = getPhysicalLocations(contactContent.locations || []);
  
  // Get main location and generate contact URL
  const mainLocation = getMainPhysicalLocation(contactContent.locations || []);
  const locationSlug = mainLocation 
    ? generateLocationSlug(mainLocation.address.city, mainLocation.address.state)
    : '';
  const contactHref = locationSlug ? `/${locationSlug}/contact` : "/contact";
  
  if (physicalLocations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 lg:px-0">
        <h2 className="text-primary font-medium text-2xl text-center md:text-left mb-2 uppercase font-heading">
          {contactContent.page_info?.subtitle || "Get in Touch"}
        </h2>
        <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left font-bold">
          {contactContent.page_info?.title || "Contact Us"}
        </h1>
        <p className="text-text text-center text-sm md:text-left w-full">
          {contactContent.page_info?.description || "We would love to hear from you!"}
        </p>
        <p className="text-text text-center mt-8">No contact information available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-0">
      <span className="text-primary font-medium text-2xl text-center md:text-left mb-4 uppercase font-heading">
        {contactContent.page_info?.subtitle || "Get in Touch"}
      </span>
      <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left font-bold">
        {contactContent.page_info?.title || "Contact Us"}
      </h1>
      <p className="text-text text-center text-sm md:text-left w-full">
        {contactContent.page_info?.description || "We would love to hear from you!"}
      </p>
      
      {/* Show only the main location */}
      <div className="pt-2 flex flex-col lg:flex-row md:gap-12 mt-8">
        <div className="lg:w-8/12 pt-4 md:py-8 rounded-lg">
          <Location contactContent={contactContent} />
        </div>
        <div className="flex flex-col w-full lg:w-4/12 justify-between">
          <div className="pt-4 md:py-8 rounded-lg">
            <h3 className="text-primary font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading">
              Contact Info
            </h3>
            <div className="flex flex-col gap-4">
              {physicalLocations.map((location, index) => (
                <div key={location.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-medium text-lg mb-3 text-primary tracking-[0.2em] uppercase font-heading">
                    {location.name}
                  </h4>
                  
                  <div className="flex flex-col mt-2 group">
                    <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                      <FaMapMarker className="w-4 h-4 -mt-1" />
                      <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Address</h4>
                    </div>
                    <p className="text-text">
                      {`${location.address.street}, ${location.address.city}, ${location.address.state} ${location.address.zip_code}`}
                    </p>
                  </div>
                  
                  {location.phone_number && (
                    <div className="flex flex-col mt-2 group">
                      <div className="flex items-center gap-1 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                        <FaPhone className="w-4 h-4 -mt-1" />
                        <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Phone</h4>
                      </div>
                      <Link href={`tel:${location.phone_number}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                        {location.phone_number}
                      </Link>
                    </div>
                  )}
                  
                  {location.email && (
                    <div className="flex flex-col mt-2 group">
                      <Link href={`mailto:${location.email}`} className="text-text hover:text-primary transition-all duration-300 ease-in-out">
                        <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                          <FaEnvelope className="w-4 h-4 -mt-1" />
                          <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Email</h4>
                        </div>
                        {location.email}
                      </Link>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(location.social_media)
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
              ))}
              
              {/* CTA Button */}
              <div className="">
                {ctaType === "chilled_butter_widget" ? (
                  <button
                    className="w-full bg-primary text-primary-foreground font-heading px-6 py-3 font-medium tracking-wide  hover:bg-primary/90 transition-all duration-300 ease-in-out rounded-lg cb-widget-btn"
                  >
                    {buttonText}
                  </button>
                ) : (
                  <Link
                    href={contactHref}
                    className="w-full bg-primary text-primary-foreground font-heading px-6 py-3 font-medium tracking-wide  hover:bg-primary/90 transition-all duration-300 ease-in-out rounded-lg inline-block text-center"
                  >
                    {buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContact;
