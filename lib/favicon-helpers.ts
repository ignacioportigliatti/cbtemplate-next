import type { WordpressImageInfo } from "./wordpress.d";

/**
 * Generates favicon link tags based on WordPress site icon
 * @param siteIcon WordPress image info for the site icon
 * @returns Array of favicon link objects for Next.js metadata
 */
export function generateFaviconLinks(siteIcon?: WordpressImageInfo) {
  if (!siteIcon?.url) {
    return [];
  }

  const links = [];

  // Standard favicon (ICO format fallback)
  links.push({
    rel: 'icon',
    url: siteIcon.url,
  });

  // PNG favicon with original size
  if (siteIcon.width && siteIcon.height) {
    links.push({
      rel: 'icon',
      type: 'image/png',
      sizes: `${siteIcon.width}x${siteIcon.height}`,
      url: siteIcon.url,
    });
  }

  // Generate different sizes based on available WordPress sizes
  const sizeMapping = [
    { size: '16x16', preferredKey: 'thumbnail' },
    { size: '32x32', preferredKey: 'thumbnail' },
    { size: '96x96', preferredKey: 'medium' },
    { size: '192x192', preferredKey: 'medium' },
  ];

  sizeMapping.forEach(({ size, preferredKey }) => {
    let faviconUrl = siteIcon.url;
    
    // Try to use the preferred size if available
    if (siteIcon.sizes && siteIcon.sizes[preferredKey as keyof typeof siteIcon.sizes]) {
      const sizeData = siteIcon.sizes[preferredKey as keyof typeof siteIcon.sizes];
      if (typeof sizeData === 'string' && sizeData) {
        faviconUrl = sizeData;
      }
    }

    links.push({
      rel: 'icon',
      type: 'image/png',
      sizes: size,
      url: faviconUrl,
    });
  });

  // Apple Touch Icon (180x180 is the standard)
  let appleTouchIconUrl = siteIcon.url;
  
  // Prefer larger size for Apple touch icon for better quality
  if (siteIcon.sizes?.medium && typeof siteIcon.sizes.medium === 'string') {
    appleTouchIconUrl = siteIcon.sizes.medium;
  }

  links.push({
    rel: 'apple-touch-icon',
    sizes: '180x180',
    url: appleTouchIconUrl,
  });

  return links;
}

/**
 * Gets the best favicon URL for a given size preference
 * @param siteIcon WordPress image info for the site icon
 * @param preferredSize Preferred size (e.g., 32, 64, 128)
 * @returns URL of the best matching favicon
 */
export function getBestFaviconUrl(siteIcon?: WordpressImageInfo, preferredSize = 32): string | null {
  if (!siteIcon?.url) {
    return null;
  }

  // If we want a small favicon, use thumbnail
  if (preferredSize <= 32 && siteIcon.sizes?.thumbnail && typeof siteIcon.sizes.thumbnail === 'string') {
    return siteIcon.sizes.thumbnail;
  }

  // For medium sizes, use medium if available
  if (preferredSize <= 300 && siteIcon.sizes?.medium && typeof siteIcon.sizes.medium === 'string') {
    return siteIcon.sizes.medium;
  }

  // Fallback to original URL
  return siteIcon.url;
}

/**
 * Generates fallback favicon configuration for Next.js metadata
 * @returns Fallback favicon configuration using local favicon
 */
export function getFallbackFavicon() {
  return {
    icon: '/favicon.ico',
  };
}
