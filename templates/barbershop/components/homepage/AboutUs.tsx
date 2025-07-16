import { AboutUsContent, HomePageContent } from "@/lib/wordpress.d";
import React from "react";
import Balancer from "react-wrap-balancer";

interface Props {
  aboutUsContent: AboutUsContent;
}

const AboutUs = (props: Props) => {
  const { aboutUsContent } = props;

  return (
    <div className="justify-start flex flex-col h-full">
      <div>
        <h3 className="text-primary text-center md:text-left font-medium mb-4 tracking-[0.2em] uppercase font-heading">
          <Balancer>{aboutUsContent.page_info.subtitle}</Balancer>
        </h3>
        <h2 className="text-4xl lg:text-5xl font-bold text-text text-center md:text-left mb-4 leading-tight font-heading">
          <Balancer>{aboutUsContent.page_info.title}</Balancer>
        </h2>
        <p className="text-text text-center md:text-left mb-8 leading-relaxed">{aboutUsContent.page_info.description}</p>
      </div>
      <div></div>
    </div>
  );
};

export default AboutUs;
