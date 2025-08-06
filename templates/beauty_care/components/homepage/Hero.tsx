import { HomePageContent } from "@/lib/wordpress.d";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";

interface Props {
  homeContent: HomePageContent;
}

const Hero = ({ homeContent }: Props) => {

  return (
    <div className="relative min-h-screen bg-background">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen py-24 pt-32 flex items-center px-8">
        <div className="flex flex-col lg:flex-row gap-24 items-center w-full">
          
          {/* Left Side - Image Carousel */}
          <div className="relative w-full lg:w-5/12 animate-scale-in animate-delay-400">
            <div className="relative w-full h-[500px] shadow-[15px_15px_0px_0px] shadow-text lg:h-[500px] rounded-xl rounded-tl-[180px] rounded-tr-none overflow-hidden">
              <HeroCarousel gallery={homeContent.hero.gallery} />
            </div>
            {/* Decorative elements - similar to the reference image */}
            <Image src="/flowers.webp" alt="Hero Decorative" width={300} height={100} className="pointer-events-none absolute lg:w-80 w-52 lg:-top-14 lg:-left-16 -top-8 -left-8 -hue-rotate-60 saturate-50 brightness-110" />
            <Image src="/flowers2.webp" alt="Hero Decorative" width={300} height={100} className="pointer-events-none absolute lg:w-80 w-52 lg:-bottom-14 lg:-right-20 -right-8 -bottom-8 -hue-rotate-60 saturate-50 brightness-110" />
          </div>

          {/* Right Side - Text Content */}
          <div className="text-center md:text-left ml-4 w-full lg:w-7/12">
            {/* Subtitle */}
            <span className="text-primary text-3xl font-heading block animate-fade-in-up animate-delay-200">
              <Balancer>{homeContent.hero.subtitle}</Balancer>
            </span>
            
            {/* Main Title - Primary H1 */}
            <h1 className="text-5xl md:text-5xl lg:text-6xl mb-4 mt-2 font-bold font-heading leading-tight animate-fade-in-up animate-delay-400">
              <Balancer>{homeContent.hero.title}</Balancer>
            </h1>
            
            {/* Description */}
            <p className="text-text/80 text-lg leading-relaxed font-sans animate-fade-in-up animate-delay-600">
             {homeContent.hero.description}
            </p>
            
            {/* CTA Button */}
            <div className="pt-4 animate-fade-in-up animate-delay-800">
              <Link
                href={homeContent.hero.button.link}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all duration-300 ease-in-out font-heading rounded-lg"
              >
                {homeContent.hero.button.label}
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
