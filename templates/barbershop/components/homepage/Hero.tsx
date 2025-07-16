import { HomePageContent } from "@/lib/wordpress.d";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";
import BackgroundCarousel from "./BackgroundCarousel";

interface Props {
  homeContent: HomePageContent;
}

const Hero = ({ homeContent }: Props) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images Carousel */}
      <BackgroundCarousel images={homeContent.hero.gallery} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex items-center justify-center px-8">
        <div className="text-center text-white">
          {/* Subtitle */}
          <h3 className="text-primary font-medium mb-4 tracking-[0.2em] uppercase font-heading">
            <Balancer>{homeContent.hero.subtitle}</Balancer>
          </h3>
          
          {/* Main Title */}
          <h1 className="text-5xl text-text md:text-6xl max-w-2xl mx-auto lg:text-8xl font-bold uppercase !leading-[0.8] font-heading">
            <Balancer>{homeContent.hero.title}</Balancer>
          </h1>
          
          {/* Description */}
          <p className="text-text max-w-2xl mx-auto mb-8 leading-relaxed font-sans">
            <Balancer>{homeContent.hero.description}</Balancer>
          </p>
          
          {/* CTA Button */}
          <Link
            href={homeContent.hero.button.link}
            className="inline-block bg-transparent border-2 border-border text-border px-8 py-4 text-lg font-medium tracking-wide uppercase hover:bg-border hover:text-background transition-all duration-300 ease-in-out font-heading"
          >
            {homeContent.hero.button.label}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
