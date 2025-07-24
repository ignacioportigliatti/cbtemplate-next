import { TeamContent } from "@/lib/wordpress.d";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  teamContent: TeamContent;
}

const Team = ({ teamContent }: Props) => {
  // Early return if no team members
  if (!teamContent.members || teamContent.members.length === 0) {
    return (
      <div className="bg-background-900 py-16 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-primary font-medium mb-1 tracking-[0.2em] uppercase font-heading">
            {teamContent.page_info.subtitle}
          </h3>
          <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading">
            {teamContent.page_info.title}
          </h2>
          <p className="text-muted-foreground">No team members available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-900 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-0">
        <div className="flex w-full md:w-5/12 flex-col justify-between text-center items-center md:items-start md:text-left ">
          <div className="pr-0 md:pr-20">
            <h3 className="text-primary font-medium mb-1 tracking-[0.2em] uppercase font-heading">
              {teamContent.page_info.subtitle}
            </h3>
            <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading">
              {teamContent.page_info.title}
            </h2>
            <h4 className="text-text/80 mb-4">{teamContent.page_info.description}</h4>
          </div>
          <Link
            href={"/team"}
            className="bg-transparent w-max border-2 font-heading border-border text-primary px-8 py-3 font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out inline-flex items-center"
          >
            View All
            <FaArrowRight className="w-4 h-4 -mt-1 ml-2" />
          </Link>
        </div>
        <div className="w-full md:w-7/12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teamContent.members.map((member) => (
                <CarouselItem key={member.member_name} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square h-64 relative overflow-hidden">
                      {member.member_photo.url && (
                        <Image
                          src={member.member_photo.url}
                          alt={member.member_name}
                          fill
                          className="object-cover aspect-square"
                        />
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h5 className="text-text font-medium">{member.member_name}</h5>
                      <p className="text-text/80 text-sm">{member.member_position}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Team;
