import { AboutUsContent } from "@/lib/wordpress.d";
import React from "react";

interface Props {
  aboutUsContent: AboutUsContent;
}

const AboutUsValues = ({ aboutUsContent }: Props) => {
  return (
    <div className="text-center md:text-left">
      <h2 className="text-primary font-medium text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading">
        {aboutUsContent.values.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aboutUsContent.values.list.map((value, index) => (
          <div
            key={index}
            className="flex flex-col"
          >
            <h3 className="text-text font-medium text-lg">{value.title}</h3>
            <p className="text-text">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsValues;
