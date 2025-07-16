import { ThemeColors } from "@/lib/wordpress.d";
import { generateThemeCSS } from "@/lib/utils";

interface ServerThemeProps {
  themeColors?: ThemeColors;
}

export function ServerTheme({ themeColors }: ServerThemeProps) {
  if (!themeColors) return null;

  const themeCSS = generateThemeCSS(themeColors);

  return (
    <style
      id="server-theme-colors"
      dangerouslySetInnerHTML={{ __html: themeCSS }}
    />
  );
} 