import { Section } from "@/components/craft";
import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.homeMetadata();
}

export default async function Home() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return (
    <Section>
      <template.HomePage />
    </Section>
  );
}

