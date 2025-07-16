import { HomePageContent } from "@/lib/wordpress.d";
import React from "react";
import Balancer from "react-wrap-balancer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Props {
  homeContent: HomePageContent;
}

const FAQ = (props: Props) => {
  const { homeContent } = props;
  return (
    <div className="bg-background-900 px-8 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h3 className="text-primary font-medium text-xl tracking-[0.2em] uppercase font-heading">
            Common Questions
          </h3>
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight font-heading">
            <Balancer>{homeContent.faq.title}</Balancer>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-0"
          >
            {homeContent.faq.questions.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="flex border-l-4 h-full font-heading text-xl border-primary items-center gap-2">
                    <p className="ml-3">{item.question}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p className="text-text/80 font-sans">{item.answer}</p>
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
