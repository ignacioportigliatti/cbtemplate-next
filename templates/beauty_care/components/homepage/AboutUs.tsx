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
        <span className="text-primary text-center md:text-left font-medium mb-2 text-2xl font-heading block">
          <Balancer>{aboutUsContent.page_info.subtitle}</Balancer>
        </span>
        <h3 className="text-4xl lg:text-5xl font-bold text-text text-center md:text-left mb-4 leading-tight font-heading">
          <Balancer>{aboutUsContent.page_info.title}</Balancer>
        </h3>
        <p className="text-text text-center md:text-left mb-8 leading-relaxed">{aboutUsContent.page_info.description}</p>
        <h4 className="text-text text-center md:text-left leading-relaxed font-bold font-heading text-2xl">{aboutUsContent.mission.title}</h4>
        <div className="!text-center md:!text-left" dangerouslySetInnerHTML={{ __html: aboutUsContent.mission.content }} />
      </div>
      <div></div>
    </div>
  );
};

export default AboutUs;
