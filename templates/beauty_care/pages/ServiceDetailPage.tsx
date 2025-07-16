import { Container, Section } from "@/components/craft";
import ServiceGallery from "@/templates/beauty_care/components/services/ServiceGallery";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getServicesContent } from "@/lib/wordpress";
import Image from "next/image";
import React from "react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const serviceContent = await getServicesContent();
  const service = serviceContent.services.find((service) => service.slug === slug);

  if (!service) {
    return {
      title: "Service not found",
      description: "The requested service could not be found",
    };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  const serviceContent = await getServicesContent();
  return serviceContent.services.map((service) => ({
    slug: service.slug,
  }));
}

const ServiceDetailPage = async (props: Props) => {
  const { slug } = await props.params;
  const serviceContent = await getServicesContent();
  const service = serviceContent.services.find((service) => service.slug === slug);

  if (!service) {
    return <div>Service not found</div>;
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title }
  ];

  return (
    <Section className="pt-24 md:pt-32 bg-background-900 pb-16">
      <Container className="max-w-7xl mx-auto px-8 xl:px-0">
        
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        
        <h1 className="text-4xl md:text-5xl font-heading text-primary text-center leading-[0.9] md:text-left font-bold">
          {service?.title}
        </h1>
        <p className="text-muted-foreground/80 text-center md:text-left w-full">
          {service?.description}
        </p>
        
        {service.featured_image && (
          <div className="py-4 w-full flex justify-center">
            <Image
              src={service.featured_image.url}
              alt={service.featured_image.alt || service.title}
              className="max-w-full w-full aspect-video object-cover max-h-[500px] h-auto rounded-lg shadow-lg"
              width={1000}
              height={1000}
            />
          </div>
        )}
        
        {service.service_page_content && (
          <div className="mt-2 w-full max-w-none prose-strong:text-text prose prose-h1:text-4xl prose-headings:text-text prose-p:text-text prose-li:text-text prose-headings:font-heading prose-headings:text-3xl prose-h1:font-heading prose-h1:text-primary prose-h1:leading-[0.9] prose-h1:font-bold " dangerouslySetInnerHTML={{ __html: service.service_page_content }} />
        )}
        {service.gallery && service.gallery.length > 0 && (
          <ServiceGallery service={service} />
        )}
      </Container>
    </Section>
  );
};

export default ServiceDetailPage;
