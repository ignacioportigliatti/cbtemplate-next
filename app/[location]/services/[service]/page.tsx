import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent, getServicesContent } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const [contactContent, servicesContent] = await Promise.all([
    getContactContent(),
    getServicesContent()
  ]);
  
  const params: Array<{ location: string; service: string }> = [];
  
  contactContent.locations.forEach(location => {
    const locationSlug = generateLocationSlug(location.address.city, location.address.state);
    
    servicesContent.services.forEach(service => {
      params.push({
        location: locationSlug,
        service: service.slug
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; service: string }> }): Promise<Metadata> {
  const { location, service } = await params;
  const [contactContent, servicesContent] = await Promise.all([
    getContactContent(),
    getServicesContent()
  ]);
  
  const locationData = findLocationBySlug(contactContent.locations, location);
  const serviceData = servicesContent.services.find(s => s.slug === service);

  if (!locationData || !serviceData) {
    return {
      title: "Service not found",
      description: "The requested service could not be found",
    };
  }

  return {
    title: `${serviceData.title} in ${locationData.address.city}, ${locationData.address.state}`,
    description: serviceData.description,
  };
}

export default async function LocationServiceDetailPage({ params }: { params: Promise<{ location: string; service: string }> }) {
  const { location, service } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  const [contactContent, servicesContent] = await Promise.all([
    getContactContent(),
    getServicesContent()
  ]);
  
  const locationData = findLocationBySlug(contactContent.locations, location);
  const serviceData = servicesContent.services.find(s => s.slug === service);
  
  if (!locationData || !serviceData) {
    return notFound();
  }
  
  return <template.LocationServiceDetailPage locationData={locationData} serviceData={serviceData} />;
} 