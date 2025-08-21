import { HomePageContent, ServicesContent, ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { generateLocationSlug, getMainPhysicalLocation } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";
import { GiHairStrands } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  homeContent: HomePageContent;
  servicesContent: ServicesContent;
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

const PopularServices = (props: Props) => {
  const { homeContent, servicesContent, contactContent, themeOptions } = props;

  // Get main location (first location) and generate slug
  const mainLocation = getMainPhysicalLocation(contactContent.locations || []);
  const locationSlug = mainLocation 
    ? generateLocationSlug(mainLocation.address.city, mainLocation.address.state)
    : '';

  // Generate the correct href for services page with location
  const servicesHref = locationSlug ? `/${locationSlug}/services` : homeContent.popular_services.button.link;

  // Generate the correct href for contact page with location
  const contactHref = locationSlug ? `/${locationSlug}/contact` : "/contact";

  // Determine CTA button text based on theme options
  const ctaType = themeOptions?.general?.cta_type || "default_form";
  const ctaButtonText = ctaType === "chilled_butter_widget" ? "Book Now" : "Get Started";

  return (
    <div className="bg-background-800 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-0">
        {/* Header Section */}
        <div className="flex w-full md:w-5/12 flex-col lg:flex-row text-center md:text-left lg:items-center lg:justify-between">
          <div className="pr-0 md:pr-8">
            <span className="text-primary font-medium mb-1 tracking-[0.2em] uppercase font-heading block scroll-animate">
              {homeContent.popular_services.subtitle}
            </span>
            <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading scroll-animate">
              <Balancer>{homeContent.popular_services.title}</Balancer>
            </h2>
            <p className="text-text/80 mb-4 scroll-animate">
                {servicesContent.page_info.description}
              </p>
            <div className="flex flex-col sm:flex-row gap-4 scroll-animate">
              <Link
                href={servicesHref}
                className="bg-transparent border-2 font-heading border-border text-primary px-8 py-3 font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out inline-flex items-center justify-center"
              >
                {homeContent.popular_services.button.label}
                <FaArrowRight className="w-4 h-4 -mt-1 ml-2" />
              </Link>
                             {ctaType === "chilled_butter_widget" ? (
                 <button
                   className="bg-primary text-primary-foreground font-heading px-8 py-3 font-medium tracking-wide uppercase hover:bg-primary/90 transition-all duration-300 ease-in-out inline-flex items-center justify-center cb-widget-btn"
                 >
                   {ctaButtonText}
                 </button>
              ) : (
                <Link
                  href={contactHref}
                  className="bg-primary text-primary-foreground font-heading px-8 py-3 font-medium tracking-wide uppercase hover:bg-primary/90 transition-all duration-300 ease-in-out inline-flex items-center justify-center"
                >
                  {ctaButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="w-full md:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {servicesContent.services
            .slice(0, homeContent.popular_services.services_to_display)
            .map((service, index) => {
              // Generate service page URL
              const serviceSlug = service.slug || service.title.toLowerCase().replace(/\s+/g, '-');
              const serviceHref = locationSlug ? `/${locationSlug}/services/${serviceSlug}` : `/services/${serviceSlug}`;
              
              return (
                <Link key={index} href={serviceHref} className="flex items-start space-x-2 group scroll-animate cursor-pointer" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <div className="flex items-center justify-center p-2 rounded-full ">
                <GiHairStrands className="flex-shrink-0 group-hover:scale-105 group-hover:text-primary transition-all ease-in-out duration-200 text-text w-6 h-6" />
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
              </Link>
            );
            })}
          
        </div>
      </div>
    </div>
  );
};

export default PopularServices;
