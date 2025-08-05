import { ServicesContent } from '@/lib/wordpress.d';
import Link from 'next/link';
import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Props {
    servicesContent: ServicesContent;
}

const ServicesGrid = ({servicesContent} : Props) => {
    return (
        <div className="max-w-7xl mx-auto px-8 xl:px-0">
            <div className="space-y-2">
              <span className="text-primary font-heading text-center md:text-left text-2xl font-bold w-full block">
                {servicesContent.page_info.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading text-text text-center leading-[0.9] md:text-left mt-1 font-bold">
                {servicesContent.page_info.title}
              </h1>
              <p className="text-muted-foreground/80 text-center md:text-left mt-1 w-full">
                {servicesContent.page_info.description}
              </p>
            </div>
            
            {!servicesContent.services || servicesContent.services.length === 0 ? (
              <div className="mt-8 p-8 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">No services available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {servicesContent.services.map((service) => (
                <Link
                  key={service.title}
                  href={`/services/${service.slug}`}
                  className="bg-background-900 rounded-lg flex text-center items-center md:text-left flex-col-reverse gap-4 md:gap-6 md:flex-row p-6 border border-border/50 hover:border-border/80 transition-all 
                  duration-300 hover:shadow-lg hover:bg-background-600 ease-in-out"
                >
                  <div className="flex flex-col h-full gap-4 xl:pr-8 md:justify-between items-center md:items-start">
                    <div>
                      <h3 className="text-2xl font-heading text-text font-bold">{service.title}</h3>
                      <p className="text-muted-foreground/80 text-sm mt-1 w-full">
                        {service.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-fit rounded-lg font-heading text-lg bg-transparent border-border/50 hover:border-border/80 hover:bg-primary hover:text-background-900"
                    >
                      Learn More
                    </Button>
                  </div>
                  {service.featured_image && (
                    <Image
                      src={service.featured_image?.url as string}
                      alt={service.featured_image?.alt as string}
                      width={192}
                      height={192}
                      className="w-full h-full md:w-48 md:h-48 aspect-square object-cover rounded-lg"
                    />
                  )}
                </Link>
                ))}
              </div>
            )}
          </div>
    )
}

export default ServicesGrid
