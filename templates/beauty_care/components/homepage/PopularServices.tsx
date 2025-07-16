import { HomePageContent, ServicesContent } from "@/lib/wordpress.d";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";
import { GiHairStrands } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  homeContent: HomePageContent;
  servicesContent: ServicesContent;
}

const PopularServices = (props: Props) => {
  const { homeContent, servicesContent } = props;

  return (
    <div className="bg-background-800 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-0">
        {/* Header Section */}
        <div className="flex w-full md:w-5/12 flex-col lg:flex-row text-center md:text-left lg:items-center lg:justify-between">
          <div className="pr-0 md:pr-8">
            <h3 className="text-primary font-medium mb-1 tracking-[0.2em] uppercase font-heading">
              {homeContent.popular_services.subtitle}
            </h3>
            <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading">
              <Balancer>{homeContent.popular_services.title}</Balancer>
            </h2>
            <h4 className="text-text/80 mb-4">
                {servicesContent.page_info.description}
              </h4>
            <Link
              href={homeContent.popular_services.button.link}
              className="bg-transparent border-2 font-heading border-border text-primary px-8 py-3 font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out inline-flex items-center"
            >
              {homeContent.popular_services.button.label}
              <FaArrowRight className="w-4 h-4 -mt-1 ml-2" />
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="w-full md:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {servicesContent.services
            .slice(0, homeContent.popular_services.services_to_display)
            .map((service, index) => (
              <div key={index} className="flex items-start space-x-2 group">
                <div className="flex items-center justify-center p-2 rounded-full ">
                <GiHairStrands className="flex-shrink-0 group-hover:scale-105 group-hover:text-primary transition-all ease-in-out duration-200 text-text w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors duration-200 font-heading">
                    {service.title}
                  </h3>
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
