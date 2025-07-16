import "@/app/globals.css";
import { getActiveTemplate, loadTemplate } from "@/lib/template-resolver";
import React from "react";

export async function generateMetadata() {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  // Delegamos la metadata al template
  return template.layoutMetadata();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const templateId = await getActiveTemplate();
  const template = await loadTemplate(templateId);
  
  return <template.Layout>{children}</template.Layout>;
}
