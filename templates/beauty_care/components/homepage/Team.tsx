import { TeamContent } from "@/lib/wordpress.d";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaArrowRight, FaFacebook, FaInstagram, FaLinkedin, FaGoogle } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Props {
  teamContent: TeamContent;
}

// Social Media Component
const SocialMediaLinks = ({ member }: { member: any }) => {
  const socialLinks = [
    { key: 'facebook', url: member.member_facebook, icon: <FaFacebook className="w-4 h-4" /> },
    { key: 'instagram', url: member.member_instagram, icon: <FaInstagram className="w-4 h-4" /> },
    { key: 'linkedin', url: member.member_linkedin, icon: <FaLinkedin className="w-4 h-4" /> },
    { key: 'google', url: member.member_google, icon: <FaGoogle className="w-4 h-4" /> },
  ].filter(link => link.url && link.url.trim() !== "");

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex gap-3 mt-3 justify-center">
      {socialLinks.map(({ key, url, icon }) => (
        <Link
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text/60 hover:text-primary transition-colors duration-300"
          aria-label={`Follow ${member.member_name} on ${key}`}
        >
          {icon}
        </Link>
      ))}
    </div>
  );
};

const Team = ({ teamContent }: Props) => {
  // Early return if no team members - hide section completely
  if (!teamContent.members || teamContent.members.length === 0) {
    return null;
  }

  const memberCount = teamContent.members.length;
  const isSingleSpecialist = memberCount === 1;
  const carouselItems = memberCount >= 3 ? 3 : memberCount;

  // Get content based on member count
  const getContent = () => {
    if (isSingleSpecialist) {
      const member = teamContent.members[0];
      return {
        subtitle: member.member_name,
        title: "Meet Our Specialist",
        description: member.member_description || "Our dedicated specialist is here to provide you with exceptional service and expertise."
      };
    }
    return {
      subtitle: teamContent.page_info.subtitle,
      title: teamContent.page_info.title,
      description: teamContent.page_info.description
    };
  };

  const content = getContent();

  return (
    <div className="bg-background-800 py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-0">
        <div className={cn("flex w-full flex-col justify-between text-center items-center md:items-start md:text-left scroll-animate-left", isSingleSpecialist ? "md:w-7/12" : "w-full md:w-5/12")}>
          <div className="pr-0 md:pr-20">
            <span className="text-primary font-medium mb-1 text-2xl font-heading block scroll-animate">
              {content.subtitle}
            </span>
            <h2 className="text-4xl lg:text-5xl mb-4 font-bold text-text leading-tight font-heading scroll-animate">
              {content.title}
            </h2>
            <p className="text-text/80 mb-4 scroll-animate">
              {content.description}
            </p>
          </div>
        </div>
        <div className={cn("w-full scroll-animate-right", isSingleSpecialist ? "md:w-5/12" : "w-full md:w-7/12")}>
          {isSingleSpecialist ? (
            // Single specialist display without carousel
            <div className="flex flex-col items-center">
              <div className="max-w-md aspect-square h-72 w-72 relative overflow-hidden rounded-lg">
                {teamContent.members[0].member_photo.url && (
                  <Image
                    src={teamContent.members[0].member_photo.url}
                    alt={teamContent.members[0].member_name}
                    fill
                    className="!object-cover"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-text font-medium text-xl">{teamContent.members[0].member_name}</h3>
                <p className="text-text/80 text-sm">{teamContent.members[0].member_position}</p>
                <SocialMediaLinks member={teamContent.members[0]} />
              </div>
            </div>
          ) : (
            // Carousel for multiple members
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {teamContent.members.map((member, index) => (
                  <CarouselItem 
                    key={member.member_name} 
                    className={`pl-2 md:pl-4 basis-full md:basis-1/${carouselItems}`}
                  >
                    <div className="flex flex-col items-center scroll-animate" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                      <div className="w-full aspect-square h-64 relative overflow-hidden rounded-lg">
                        {member.member_photo.url && (
                          <Image
                            src={member.member_photo.url}
                            alt={member.member_name}
                            fill
                            className="object-cover !aspect-square"
                          />
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-text font-medium">{member.member_name}</h3>
                        <p className="text-text/80 text-sm">{member.member_position}</p>
                        <SocialMediaLinks member={member} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
