"use client";

import { HomePageContent, ThemeOptions, ContactContent } from "@/lib/wordpress.d";
import React, { useState } from "react";
import Balancer from "react-wrap-balancer";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";
import { getMainPhysicalLocation, getStateFullName } from "@/lib/utils";
import ContactDialog from "./ContactDialog";

interface Props {
  homeContent: HomePageContent;
  themeOptions?: ThemeOptions;
  contactContent?: ContactContent;
}

const Hero = ({ homeContent, themeOptions, contactContent }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Determine button text and behavior based on CTA type
  const ctaType = themeOptions?.general?.cta_type || "default_form";
  const buttonText = ctaType === "chilled_butter_widget" 
    ? homeContent.hero.button.label 
    : "Get Started";

  // Get main location and generate contact URL
  const mainLocation = getMainPhysicalLocation(contactContent?.locations || []);
  const contactHref = "/contact"; // Use singular contact page

  return (
    <div className="relative min-h-screen bg-background">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen py-24 md:pt-32 pt-40  flex items-center px-8">
        <div className="flex flex-col lg:flex-row md:gap-24 gap-12 items-center w-full">
          
          {/* Left Side - Image Carousel */}
          <div className="relative w-10/12 lg:w-5/12 animate-scale-in animate-delay-400">
            <div className="relative w-full h-[400px] shadow-[15px_15px_0px_0px] shadow-text lg:h-[500px] rounded-xl md:rounded-tl-[180px] rounded-tl-[140px] rounded-tr-none overflow-hidden">
              <HeroCarousel gallery={homeContent.hero.gallery} />
            </div>
            {/* Decorative elements - similar to the reference image */}
            <Image src="/flowers.webp" alt="Hero Decorative" width={300} height={100} className="pointer-events-none absolute lg:w-80 w-44 lg:-top-14 lg:-left-16 -top-6 -left-6 -hue-rotate-60 saturate-50 brightness-110" />
            <Image src="/flowers2.webp" alt="Hero Decorative" width={300} height={100} className="pointer-events-none absolute lg:w-80 w-44 lg:-bottom-14 lg:-right-20 -right-10 -bottom-10 -hue-rotate-60 saturate-50 brightness-110" />
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
              {ctaType === "chilled_butter_widget" ? (
                <button
                  className="inline-flex items-center gap-2 bg-transparent text-primary px-8 py-4 text-xl font-medium border-2 hover:text-primary-foreground border-primary hover:bg-primary transition-all duration-300 ease-in-out font-heading rounded-lg cb-widget-btn"
                >
                  {buttonText}
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
                </button>
              ) : (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center gap-2 bg-transparent text-primary px-8 py-4 text-xl font-medium border-2 hover:text-primary-foreground border-primary hover:bg-primary transition-all duration-300 ease-in-out font-heading rounded-lg"
                >
                  {buttonText}
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
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <ContactDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        contactContent={contactContent}
        themeOptions={themeOptions}
      />

    </div>
  );
};

export default Hero;
