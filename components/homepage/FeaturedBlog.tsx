import { HomePageContent, Post } from "@/lib/wordpress.d";
import React from "react";
import Balancer from "react-wrap-balancer";
import { PostCard } from "../blog/post-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  homeContent: HomePageContent;
  blogContent: Post[];
}

const FeaturedBlog = (props: Props) => {
  const { homeContent, blogContent } = props;
  return (
    <div className="bg-background-800 px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h3 className="text-primary font-medium text-xl tracking-[0.2em] uppercase font-heading">
            <Balancer>{homeContent.blog.subtitle}</Balancer>
          </h3>
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight font-heading">
            <Balancer>{homeContent.blog.title}</Balancer>
          </h2>
        </div>

        {/* Blog Posts Carousel */}
        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent className="-ml-4">
            {blogContent.map((post) => (
              <CarouselItem
                key={post.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1 h-full">
                  <div className="h-full">
                    <PostCard className="rounded-none" post={post} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-primary hover:text-primary-foreground border-primary hover:border-primary-foreground" />
          <CarouselNext className="text-primary hover:text-primary-foreground border-primary hover:border-primary-foreground" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedBlog;
