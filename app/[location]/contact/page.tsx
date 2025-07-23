import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { getContactContent } from "@/lib/wordpress";
import { generateLocationSlug, findLocationBySlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateStaticParams() {
  const contactContent = await getContactContent();
  
  return contactContent.locations.map(location => ({
    location: generateLocationSlug(location.address.city, location.address.state)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const contactContent = await getContactContent();
  const locationData = findLocationBySlug(contactContent.locations, location);
  
  if (!locationData) {
    return {
      title: "Location not found",
      description: "The requested location could not be found",
    };
  }

  return {
    title: `Contact Us in ${locationData.address.city}, ${locationData.address.state}`,
    description: `Contact us in ${locationData.address.city}`,
  };
}

export default async function LocationContactPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  const contactContent = await getContactContent();
  const locationData = findLocationBySlug(contactContent.locations, location);
  
  if (!locationData) {
    return notFound();
  }
  
  return <template.LocationContactPage locationData={locationData} contactContent={contactContent} />;
} 