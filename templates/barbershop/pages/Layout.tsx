import { Inter as FontSans, Teko as FontHeading } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeWrapper } from "@/components/theme/theme-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nav } from "@/templates/barbershop/components/layout/Nav";
import { getContactContent, getThemeOptions } from "@/lib/wordpress";
import { Footer } from "@/templates/barbershop/components/layout/Footer";
import { ChilledButterScript } from "@/components/ChilledButterScript";
import { HeaderScripts } from "@/components/HeaderScripts";

import React, { Suspense } from "react";

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
    const { getSiteConfig } = await import("@/site.config");
    const siteConfig = await getSiteConfig();
    const themeOptions = await getThemeOptions();
    
    const title = siteConfig.site_name;
    const description = siteConfig.site_description;
    const logoUrl = themeOptions.general.site_logo?.url;
    
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
      icons: {
        icon: [
          { url: '/api/favicon?size=16', sizes: '16x16', type: 'image/png' },
          { url: '/api/favicon?size=32', sizes: '32x32', type: 'image/png' },
          { url: '/api/favicon', type: 'image/png' },
        ],
        shortcut: '/api/favicon',
        apple: [
          { url: '/api/favicon?size=apple', sizes: '180x180', type: 'image/png' },
        ],
      },
      openGraph: {
        title: title,
        description: description,
        type: "website",
        url: siteConfig.site_domain,
        siteName: title,
        images: [
          {
            url: `${siteConfig.site_domain}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`,
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
        images: [`${siteConfig.site_domain}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}${logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ''}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata with local favicon
    return {
      title: "Your Business",
      description: "Professional services",
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      alternates: {
        canonical: "/",
      },
      icons: {
        icon: '/api/favicon',
        shortcut: '/api/favicon',
        apple: '/api/favicon?size=apple',
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
        <ChilledButterScript 
          scriptTag={themeOptions?.general?.cta_script_tag}
          ctaType={themeOptions?.general?.cta_type}
        />
        <HeaderScripts 
          headerScripts={themeOptions?.general?.header_scripts}
        />
      </body>
    </html>
  );
}
