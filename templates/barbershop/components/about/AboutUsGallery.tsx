'use client'

import React, { useState } from 'react'
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import { AboutUsContent } from '@/lib/wordpress.d';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Autoplay from "embla-carousel-autoplay";

interface Props {
    aboutUsContent: AboutUsContent;
}

const AboutUsGallery = ({ aboutUsContent }: Props) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Early return if no gallery
    if (!aboutUsContent.gallery || aboutUsContent.gallery.length === 0) {
        return (
            <div className="mt-8 p-8 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">No gallery images available</p>
            </div>
        );
    }

    // Transformar las imágenes al formato que espera yet-another-react-lightbox
    const lightboxImages = aboutUsContent.gallery.map((image) => ({
        src: image.url,
        alt: image.alt || 'Gallery image',
        width: image.width,
        height: image.height,
    }));

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
      )

    return (
        <div className="mt-8 scroll-animate">
            <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full max-w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {aboutUsContent.gallery.map((image, index) => (
                        <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full md:basis-1/4">
                            <div className="p-1 scroll-animate" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                                <Image 
                                    src={image.url} 
                                    alt={image.alt || 'Gallery image'} 
                                    width={400} 
                                    height={400} 
                                    className="w-full aspect-square object-cover rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer" 
                                    onClick={() => openLightbox(index)}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={lightboxImages}
                carousel={{
                    finite: false,
                }}
                animation={{ 
                    fade: 300,
                    swipe: 500,
                }}
                controller={{
                    closeOnPullDown: true,
                    closeOnBackdropClick: true,
                }}
            />
        </div>
    )
}

export default AboutUsGallery
