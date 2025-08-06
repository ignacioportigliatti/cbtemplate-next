import { AboutUsContent } from "@/lib/wordpress.d";
import React from "react";

interface Props {
  aboutUsContent: AboutUsContent;
}

const AboutUsValues = ({ aboutUsContent }: Props) => {
  return (
    <div className="text-center md:text-left scroll-animate">
      <h3 className="text-primary text-2xl mt-8 text-center font-bold md:text-left font-heading scroll-animate">
        {aboutUsContent.values.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {aboutUsContent.values.list.map((value, index) => (
          <div
            key={index}
            className="flex rounded-lg bg-background-900 hover:bg-background-800 transition-all duration-300 p-6 flex-col scroll-animate"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            <h3 className="text-text font-bold text-2xl mb-2 font-heading">{value.title}</h3>
            <p className="text-text">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsValues;
