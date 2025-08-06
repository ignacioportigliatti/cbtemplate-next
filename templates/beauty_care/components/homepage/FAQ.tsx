import { HomePageContent } from "@/lib/wordpress.d";
import React from "react";
import Balancer from "react-wrap-balancer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaCircle } from "react-icons/fa";

interface Props {
  homeContent: HomePageContent;
}

const FAQ = (props: Props) => {
  const { homeContent } = props;
  return (
    <div className="bg-background-950 px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 scroll-animate">
          <span className="text-primary font-medium text-2xl font-heading block scroll-animate">
            Common Questions
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight font-heading mt-2 scroll-animate">
            <Balancer>{homeContent.faq.title}</Balancer>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="scroll-animate">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-0"
          >
            {homeContent.faq.questions.map((item, index) => (
              <AccordionItem key={index} className="border border-border/20 bg-background-900 rounded-lg mb-1 scroll-animate" value={`item-${index}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <AccordionTrigger className="px-4">
                  <div className="flex h-full font-heading text-lg lg:text-2xl items-center gap-2">
                    <FaCircle className="w-4 h-4 text-primary" />
                    <p className="ml-3">{item.question}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex text-center md:text-left flex-col gap-4 text-balance px-4 bg-background-950 pt-4 rounded-b-lg">
                  <p className="text-text/80 text-base font-sans">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
