"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface BackgroundCarouselProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
}

const BackgroundCarousel = ({ images }: BackgroundCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % images.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0">
      {images && images.length > 0 && images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0} // Prioritize first image for LCP
            quality={90}
            sizes="100vw"
          />
        </div>
      ))}
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-background-900/80 z-10"></div>
    </div>
  );
};

export default BackgroundCarousel; 