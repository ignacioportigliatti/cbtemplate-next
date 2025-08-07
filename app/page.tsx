import { Section } from "@/components/craft";
import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/StructuredData";
import { getBusinessSchemaData } from "@/lib/structured-data-helpers";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.homeMetadata();
}

export default async function Home() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Get structured data for rich snippets
  const schemaData = await getBusinessSchemaData();
  
  return (
    <>
      {/* Structured Data for Rich Snippets */}
      {schemaData?.business && (
        <LocalBusinessSchema 
          business={schemaData.business}
          services={schemaData.services}
          reviews={schemaData.reviews}
        />
      )}
      {schemaData?.organization && (
        <OrganizationSchema organization={schemaData.organization} />
      )}
      
      <Section>
        <template.HomePage />
      </Section>
    </>
  );
}

