import { AboutUsContent } from "@/lib/wordpress.d";
import React from "react";

interface Props {
  aboutUsContent: AboutUsContent;
}

const AboutUsValues = ({ aboutUsContent }: Props) => {
  return (
    <div className="text-center md:text-left scroll-animate">
      <h2 className="text-primary font-medium mt-8 text-xl text-center md:text-left tracking-[0.2em] uppercase font-heading scroll-animate">
        {aboutUsContent.values.title}
      </h2>
      <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
        {aboutUsContent.values.list.map((value, index) => (
          <div
            key={index}
            className="flex border cursor-default hover:bg-background-900 transition-all duration-300 border-border/50 p-4 flex-col scroll-animate"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            <h3 className="text-text font-medium font-heading text-2xl">{value.title}</h3>
            <p className="text-text">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsValues;
