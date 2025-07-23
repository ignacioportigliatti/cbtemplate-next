import { HomePageContent, ReviewsContent } from "@/lib/wordpress.d";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Balancer from "react-wrap-balancer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaStar } from "react-icons/fa";
import { MdStarOutline } from "react-icons/md";

interface Props {
  homeContent: HomePageContent;
  reviewsContent: ReviewsContent;
}

const Reviews = ({ homeContent, reviewsContent }: Props) => {
  return (
    <div className="bg-background-600 px-8 lg:px-16 xl:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-2xl font-heading">
            {reviewsContent.page_info.subtitle}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-2 leading-tight font-heading mt-2">
            <Balancer>{homeContent.reviews.title}</Balancer>
          </h2>
          <p className="text-text/80 leading-relaxed font-sans">{reviewsContent.page_info.description}</p>
        </div>

        {/* Reviews Carousel */}
        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent className="-ml-4">
            {reviewsContent.reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1 h-full">
                  <Card className="bg-background-900 hover:bg-background-800 transition-all duration-300 border border-border/20 hover:border-border rounded-lg hover:shadow-xl h-full min-h-[180px] flex flex-col">
                    <CardHeader className="pb-2">
                    <p className="text-text/80 leading-relaxed font-sans">{review.review}</p>
                    </CardHeader>
                    <CardFooter className="pt-0 flex justify-between mt-auto">
                    
                      {review.stars && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: parseInt(review.stars) }).map((_, starIndex) => (
                            <MdStarOutline
                              className="w-5 h-5 text-accent"
                              key={starIndex}
                            />
                          ))}
                        </div>
                      )}
                      <CardTitle className="text-2xl font-bold text-text font-heading">
                        {review.reviewer_name}
                      </CardTitle>
                    </CardFooter>
                  </Card>
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

export default Reviews;
