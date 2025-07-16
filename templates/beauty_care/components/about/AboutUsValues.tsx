import { AboutUsContent } from "@/lib/wordpress.d";
import React from "react";

interface Props {
  aboutUsContent: AboutUsContent;
}

const AboutUsValues = ({ aboutUsContent }: Props) => {
  return (
    <div className="text-center md:text-left">
      <h5 className="text-primary text-2xl text-center font-bold md:text-left font-heading">
        {aboutUsContent.values.title}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {aboutUsContent.values.list.map((value, index) => (
          <div
            key={index}
            className="flex rounded-lg bg-background-900 hover:bg-background-800 transition-all duration-300 p-6 flex-col"
          >
            <h4 className="text-text font-bold text-2xl mb-2 font-heading">{value.title}</h4>
            <p className="text-text">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsValues;
