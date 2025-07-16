"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { ThemeColors } from "@/lib/wordpress.d";
import { generateThemeCSS } from "@/lib/utils";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

interface DynamicThemeProviderProps {
  children: React.ReactNode;
  themeColors?: ThemeColors;
}

export function DynamicThemeProvider({ children, themeColors }: DynamicThemeProviderProps) {
  React.useEffect(() => {
    if (!themeColors) return;

    // Remove existing dynamic theme styles
    const existingStyle = document.getElementById('dynamic-theme-colors');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = 'dynamic-theme-colors';
    style.textContent = generateThemeCSS(themeColors);
    
    // Insert into head
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      const styleElement = document.getElementById('dynamic-theme-colors');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [themeColors]);

  return <>{children}</>;
}
