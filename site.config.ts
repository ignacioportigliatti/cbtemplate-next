type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

// Función para obtener la configuración dinámica del sitio
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    // Importación dinámica para evitar que se ejecute en el cliente
    const { getThemeOptions } = await import("@/lib/wordpress");
    const themeOptions = await getThemeOptions();
    
    return {
      site_name: themeOptions.general.site_name || "Your Business",
      site_description: themeOptions.general.site_description || "Professional services",
      site_domain: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000",
    };
  } catch (error) {
    console.error("Error getting site config:", error);
    // Fallback configuration
    return {
      site_name: "Your Business",
      site_description: "Professional services",
      site_domain: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000",
    };
  }
}

// Configuración estática para componentes del cliente (fallback)
export const siteConfig: SiteConfig = {
  site_name: "Your Business",
  site_description: "Professional services",
  site_domain: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000",
};
