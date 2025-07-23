"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { HomePageContent, WordpressImageInfo } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

interface Props {
    gallery: WordpressImageInfo[];
    imageClassName?: string;
}

const plugin = Autoplay({
    delay: 5000,
  });

const HeroCarousel = ({ gallery, imageClassName }: Props) => {
  return (
    <Carousel
      plugins={[plugin]}
      opts={{
        loop: true,
        align: "start",
      }}
      className="w-full h-full"
    >
      <CarouselContent className="h-full">
        {gallery && gallery.length > 0 && gallery.map((image, index) => (
          <CarouselItem
            key={index}
            className="h-full pl-0"
          >
              <Image
                src={image.url}
                alt={image.alt}
                className={cn("object-cover w-full h-[500px] lg:h-[600px]", imageClassName)}
                width={640}
                height={640}
                priority={index === 0}
                quality={90}
              />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroCarousel;
