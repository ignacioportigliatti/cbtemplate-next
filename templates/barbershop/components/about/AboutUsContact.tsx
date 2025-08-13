import { ContactContent } from "@/lib/wordpress.d";
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

interface Props {
  contactContent: ContactContent;
}

const AboutUsContact = ({ contactContent }: Props) => {
  // Use only the main location (index 0)
  const mainLocation = contactContent.locations?.[0];
  
  if (!mainLocation) {
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
              {mainLocation.name || "Contact Info"}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaMapMarker className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Address</h4>
                </div>
                <p className="text-text">
                  {mainLocation.address.full_address || 
                   `${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}`}
                </p>
              </div>
              {mainLocation.phone_number && (
                <div className="flex flex-col mt-2 group">
                  <div className="flex items-center gap-1 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                    <FaPhone className="w-4 h-4 -mt-1" />
                    <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Phone</h4>
                  </div>
                  <p className="text-text">{mainLocation.phone_number}</p>
                </div>
              )}
              {mainLocation.email && (
                <div className="flex flex-col mt-2 group">
                  <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                    <FaEnvelope className="w-4 h-4 -mt-1" />
                    <h4 className="font-medium tracking-[0.2em] uppercase font-heading">Email</h4>
                  </div>
                  <p className="text-text">{mainLocation.email}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(mainLocation.social_media)
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
  );
};

export default AboutUsContact;
