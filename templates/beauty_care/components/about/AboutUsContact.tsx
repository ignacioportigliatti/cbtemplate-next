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
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";

interface Props {
  contactContent: ContactContent;
}

const AboutUsContact = ({ contactContent }: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-8 flex flex-col items-center md:items-start lg:px-0">
      <div>
        <span className="text-primary font-medium text-3xl text-center md:text-left mb-2 font-heading">
          {contactContent.page_info.subtitle}
        </span>
        <h1 className="text-4xl md:text-5xl font-heading text-text text-center md:text-left mb-2 font-bold">
          {contactContent.page_info.title}
        </h1>
        <p className="text-text text-center text-sm md:text-left w-full">
          {contactContent.page_info.description}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row md:gap-12 w-full">
      <div className="w-full lg:w-4/12 ">
          <div className="flex flex-col h-full pt-4 md:py-8 rounded-lg">
            <h3 className="text-primary text-2xl text-center md:text-left font-bold font-heading">
              Contact Info
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaMapMarker className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium capitalize">Address</h4>
                </div>
                <p className="text-text">{contactContent.location.address}</p>
              </div>
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-1 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaEnvelope className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium capitalize">Phone Number</h4>
                </div>
                <p className="text-text">{contactContent.location.phone_number}</p>
              </div>
              <div className="flex flex-col mt-2 group">
                <div className="flex items-center gap-2 text-text group-hover:text-primary transition-all duration-300 ease-in-out">
                  <FaEnvelope className="w-4 h-4 -mt-1" />
                  <h4 className="font-medium capitalize">Email Address</h4>
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
                          className="font-medium capitalize"
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
        <div className="lg:w-8/12 pt-4 md:py-8 rounded-lg">
          <Location contactContent={contactContent} />
        </div>
        
      </div>
    </div>
  );
};

export default AboutUsContact;
