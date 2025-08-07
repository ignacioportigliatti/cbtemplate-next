import { HomePageContent, ServicesContent, ContactContent } from "@/lib/wordpress.d";
import { generateLocationSlug } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";
import { MdFaceRetouchingNatural } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  homeContent: HomePageContent;
  servicesContent: ServicesContent;
  contactContent: ContactContent;
}

const PopularServices = (props: Props) => {
  const { homeContent, servicesContent, contactContent } = props;

  // Get main location (first location) and generate slug
  const mainLocation = contactContent.locations[0];
  const locationSlug = mainLocation 
    ? generateLocationSlug(mainLocation.address.city, mainLocation.address.state)
    : '';

  // Generate the correct href for services page with location
  const servicesHref = locationSlug ? `/${locationSlug}/services` : homeContent.popular_services.button.link;

  return (
    <div className="bg-background-900 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-start justify-between gap-8">
        {/* Header Section */}
        <div className="flex w-full md:w-5/12 flex-col lg:flex-row text-center md:text-left lg:items-center lg:justify-between">
          <div className="pr-0 md:pr-8">
            <span className="text-primary font-medium mb-1 text-2xl font-heading block scroll-animate">
              {homeContent.popular_services.subtitle}
            </span>
            <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading scroll-animate">
              <Balancer>{homeContent.popular_services.title}</Balancer>
            </h2>
            <p className="text-text/80 mb-4 scroll-animate">{servicesContent.page_info.description}</p>
            <Link
              href={servicesHref}
              className="bg-transparent border-2 rounded-lg font-heading border-border text-primary px-8 py-3 font-bold text-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out inline-flex items-center scroll-animate"
            >
              {homeContent.popular_services.button.label}
              <FaArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="w-full md:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-2">
          {servicesContent.services
            .slice(0, homeContent.popular_services.services_to_display)
            .map((service, index) => (
              <div
                key={index}
                className="flex items-start bg-background-800 opacity-80 cursor-default hover:opacity-100 transition-all duration-300 ease-in-out rounded-lg p-6 space-x-2 group scroll-animate"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center justify-center p-2 rounded-full ">
                  <MdFaceRetouchingNatural className="flex-shrink-0 group-hover:scale-105 group-hover:text-primary transition-all ease-in-out duration-200 text-text w-6 h-6" />
                </div>
                <div className="flex-1">
                  {index < 2 ? (
                    <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors duration-200 font-heading">
                      {service.title}
                    </h3>
                  ) : (
                    <div className="text-2xl font-bold text-text group-hover:text-primary transition-colors duration-200 font-heading">
                      {service.title}
                    </div>
                  )}
                  <p className="text-text mt leading-relaxed font-sans text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PopularServices;
