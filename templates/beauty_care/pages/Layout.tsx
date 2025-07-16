import { Inter as FontSans, Poppins as FontHeading } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nav } from "@/templates/beauty_care/components/layout/Nav";
import { getContactContent, getThemeOptions } from "@/lib/wordpress";
import { Footer } from "@/templates/beauty_care/components/layout/Footer";
import React from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const themeOptions = await getThemeOptions();
    
    const title = themeOptions.general.site_name || "Chilled Butter Template";
    const description = themeOptions.general.site_description || 
      "A starter template for Next.js with WordPress as a headless CMS.";

    return {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description: description,
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        title: title,
        description: description,
        type: "website",
        url: siteConfig.site_domain,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Chilled Butter Template",
      description: "A starter template for Next.js with WordPress as a headless CMS.",
      metadataBase: new URL(siteConfig.site_domain),
      alternates: {
        canonical: "/",
      },
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get theme options for dynamic colors
  const themeOptions = await getThemeOptions();
  const contactContent = await getContactContent();

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body className={cn("min-h-screen font-sans antialiased overflow-x-hidden", fontSans.variable, fontHeading.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeWrapper themeColors={themeOptions?.colors}>
            <Nav themeOptions={themeOptions} contactContent={contactContent} />
            {children}
            <Footer themeOptions={themeOptions} contactContent={contactContent} />
          </ThemeWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
