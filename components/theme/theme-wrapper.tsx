import { ThemeColors } from "@/lib/wordpress.d";
import { ServerTheme } from "./server-theme";
import { DynamicThemeProvider } from "./theme-provider";

interface ThemeWrapperProps {
  children: React.ReactNode;
  themeColors?: ThemeColors;
}

export function ThemeWrapper({ children, themeColors }: ThemeWrapperProps) {
  return (
    <>
      <ServerTheme themeColors={themeColors} />
      <DynamicThemeProvider themeColors={themeColors}>
        {children}
      </DynamicThemeProvider>
    </>
  );
} 