import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ContactLocation, SEOLocation } from "./wordpress.d"
import { ThemeColors } from "./wordpress.d"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts hex color to HSL format for CSS custom properties
 */
export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Adjusts the lightness of an HSL color string
 */
export function adjustLightness(hslString: string, adjustment: number): string {
  const [h, s, l] = hslString.split(' ').map(val => parseFloat(val));
  const newL = Math.max(0, Math.min(100, l + adjustment));
  return `${h} ${s}% ${newL}%`;
}

/**
 * Determines the appropriate base position for a color based on its lightness
 */
export function getBasePosition(hslString: string): number {
  const [h, s, l] = hslString.split(' ').map(val => parseFloat(val));
  
  // Determine position based on lightness
  if (l <= 15) return 950;      // Very dark colors (black, dark grays)
  if (l <= 25) return 900;      // Dark colors
  if (l <= 35) return 800;      // Medium dark colors
  if (l <= 45) return 700;      // Slightly dark colors
  if (l <= 55) return 600;      // Medium colors
  if (l <= 65) return 500;      // Balanced colors
  if (l <= 75) return 400;      // Slightly light colors
  if (l <= 85) return 300;      // Medium light colors
  if (l <= 90) return 200;      // Light colors
  if (l <= 95) return 100;      // Very light colors
  return 50;                    // Nearly white colors
}

/**
 * Generates color variations from a base color with intelligent positioning
 */
export function generateColorVariations(baseColor: string) {
  const baseHsl = hexToHsl(baseColor);
  const basePosition = getBasePosition(baseHsl);
  const [h, s, currentL] = baseHsl.split(' ').map(val => parseFloat(val));
  
  // Determine if we're working with a light or dark base color
  const isLightBase = currentL > 50;
  
  // Define target lightness values based on whether the base is light or dark
  const adjustments = isLightBase ? {
    // For light base colors (like white), generate darker variations
    50: Math.max(currentL - 45, 5),   // Much darker
    100: Math.max(currentL - 35, 10), // Darker
    200: Math.max(currentL - 25, 15), // Dark
    300: Math.max(currentL - 20, 20), // Medium dark
    400: Math.max(currentL - 15, 25), // Slightly dark
    500: Math.max(currentL - 10, 30), // Balanced
    600: Math.max(currentL - 5, 35),  // Slightly light
    700: currentL,                     // Base color
    800: Math.min(currentL + 5, 85),  // Light
    900: Math.min(currentL + 10, 90), // Very light
    950: Math.min(currentL + 15, 95), // Nearly white
  } : {
    // For dark base colors (like black), generate lighter variations
    50: Math.min(currentL + 45, 95),  // Much lighter
    100: Math.min(currentL + 35, 90), // Lighter
    200: Math.min(currentL + 25, 85), // Light
    300: Math.min(currentL + 20, 80), // Medium light
    400: Math.min(currentL + 15, 75), // Slightly light
    500: Math.min(currentL + 10, 70), // Balanced
    600: Math.min(currentL + 5, 65),  // Slightly dark
    700: currentL,                     // Base color
    800: Math.max(currentL - 5, 15),  // Dark
    900: Math.max(currentL - 10, 10), // Very dark
    950: Math.max(currentL - 15, 5),  // Nearly black
  };
  
  const variations: Record<string, string> = {};
  
  // Generate each variation
  Object.entries(adjustments).forEach(([key, targetLightness]) => {
    if (parseInt(key) === basePosition) {
      // Use the original color for the base position
      variations[key] = baseHsl;
    } else {
      // Use the calculated target lightness
      variations[key] = `${h} ${s}% ${targetLightness}%`;
    }
  });
  
  return variations;
}

/**
 * Converts WordPress theme colors to CSS custom properties
 */
export function themeColorsToCssProperties(themeColors: ThemeColors): Record<string, string> {
  try {
    // Generate color variations
    const backgroundVariations = generateColorVariations(themeColors.background_color);
    const primaryVariations = generateColorVariations(themeColors.primary_color);
    const secondaryVariations = generateColorVariations(themeColors.secondary_color);
    const accentVariations = generateColorVariations(themeColors.accent_color);
    
    return {
      // Base colors
      '--primary': hexToHsl(themeColors.primary_color),
      '--secondary': hexToHsl(themeColors.secondary_color),
      '--accent': hexToHsl(themeColors.accent_color),
      '--text': hexToHsl(themeColors.text_color),
      '--background': hexToHsl(themeColors.background_color),
      '--foreground': hexToHsl(themeColors.text_color),
      '--border': hexToHsl(themeColors.border_color),
      '--muted': hexToHsl(themeColors.muted_color),
      '--destructive': hexToHsl(themeColors.destructive_color),
      '--input': hexToHsl(themeColors.border_color),
      '--ring': hexToHsl(themeColors.primary_color),
      '--card': hexToHsl(themeColors.background_color),
      '--card-foreground': hexToHsl(themeColors.text_color),
      '--popover': hexToHsl(themeColors.background_color),
      '--popover-foreground': hexToHsl(themeColors.text_color),
      '--primary-foreground': hexToHsl(themeColors.background_color),
      '--secondary-foreground': hexToHsl(themeColors.text_color),
      '--accent-foreground': hexToHsl(themeColors.text_color),
      '--muted-foreground': hexToHsl(themeColors.text_color),
      '--destructive-foreground': hexToHsl(themeColors.background_color),
      
      // Background variations (para diferentes secciones)
      '--background-50': backgroundVariations['50'],
      '--background-100': backgroundVariations['100'],
      '--background-200': backgroundVariations['200'],
      '--background-300': backgroundVariations['300'],
      '--background-400': backgroundVariations['400'],
      '--background-500': backgroundVariations['500'],
      '--background-600': backgroundVariations['600'],
      '--background-700': backgroundVariations['700'],
      '--background-800': backgroundVariations['800'],
      '--background-900': backgroundVariations['900'],
      '--background-950': backgroundVariations['950'],
      
      // Primary variations
      '--primary-50': primaryVariations['50'],
      '--primary-100': primaryVariations['100'],
      '--primary-200': primaryVariations['200'],
      '--primary-300': primaryVariations['300'],
      '--primary-400': primaryVariations['400'],
      '--primary-500': primaryVariations['500'],
      '--primary-600': primaryVariations['600'],
      '--primary-700': primaryVariations['700'],
      '--primary-800': primaryVariations['800'],
      '--primary-900': primaryVariations['900'],
      '--primary-950': primaryVariations['950'],
      
      // Secondary variations
      '--secondary-50': secondaryVariations['50'],
      '--secondary-100': secondaryVariations['100'],
      '--secondary-200': secondaryVariations['200'],
      '--secondary-300': secondaryVariations['300'],
      '--secondary-400': secondaryVariations['400'],
      '--secondary-500': secondaryVariations['500'],
      '--secondary-600': secondaryVariations['600'],
      '--secondary-700': secondaryVariations['700'],
      '--secondary-800': secondaryVariations['800'],
      '--secondary-900': secondaryVariations['900'],
      '--secondary-950': secondaryVariations['950'],
      
      // Accent variations
      '--accent-50': accentVariations['50'],
      '--accent-100': accentVariations['100'],
      '--accent-200': accentVariations['200'],
      '--accent-300': accentVariations['300'],
      '--accent-400': accentVariations['400'],
      '--accent-500': accentVariations['500'],
      '--accent-600': accentVariations['600'],
      '--accent-700': accentVariations['700'],
      '--accent-800': accentVariations['800'],
      '--accent-900': accentVariations['900'],
      '--accent-950': accentVariations['950'],
    };
  } catch (error) {
    console.error('Error converting theme colors:', error);
    return {};
  }
}

/**
 * Generates CSS string from theme colors
 */
export function generateThemeCSS(themeColors: ThemeColors): string {
  const cssProps = themeColorsToCssProperties(themeColors);
  
  const rootVars = Object.entries(cssProps)
    .map(([property, value]) => `    ${property}: ${value} !important;`)
    .join('\n');

  return `
    :root {
${rootVars}
    }
  `;
}

// State abbreviation mapping
const STATE_ABBREVIATIONS: { [key: string]: string } = {
  'alabama': 'al',
  'alaska': 'ak',
  'arizona': 'az',
  'arkansas': 'ar',
  'california': 'ca',
  'colorado': 'co',
  'connecticut': 'ct',
  'delaware': 'de',
  'florida': 'fl',
  'georgia': 'ga',
  'hawaii': 'hi',
  'idaho': 'id',
  'illinois': 'il',
  'indiana': 'in',
  'iowa': 'ia',
  'kansas': 'ks',
  'kentucky': 'ky',
  'louisiana': 'la',
  'maine': 'me',
  'maryland': 'md',
  'massachusetts': 'ma',
  'michigan': 'mi',
  'minnesota': 'mn',
  'mississippi': 'ms',
  'missouri': 'mo',
  'montana': 'mt',
  'nebraska': 'ne',
  'nevada': 'nv',
  'new hampshire': 'nh',
  'new jersey': 'nj',
  'new mexico': 'nm',
  'new york': 'ny',
  'north carolina': 'nc',
  'north dakota': 'nd',
  'ohio': 'oh',
  'oklahoma': 'ok',
  'oregon': 'or',
  'pennsylvania': 'pa',
  'rhode island': 'ri',
  'south carolina': 'sc',
  'south dakota': 'sd',
  'tennessee': 'tn',
  'texas': 'tx',
  'utah': 'ut',
  'vermont': 'vt',
  'virginia': 'va',
  'washington': 'wa',
  'west virginia': 'wv',
  'wisconsin': 'wi',
  'wyoming': 'wy'
};

// Location utilities
export function generateLocationSlug(city: string, state: string): string {
  const stateFullName = getStateFullName(state);
  return `${stateFullName}/${city.toLowerCase().replace(/\s+/g, '-')}`;
}

export function getStateAbbreviation(stateName: string): string {
  const normalizedState = stateName.toLowerCase().trim();
  return STATE_ABBREVIATIONS[normalizedState] || stateName.toLowerCase();
}

export function getStateFullName(stateAbbr: string): string {
  const normalizedAbbr = stateAbbr.toLowerCase().trim();
  // Find the full name by looking for the abbreviation in the values
  const fullName = Object.keys(STATE_ABBREVIATIONS).find(
    key => STATE_ABBREVIATIONS[key] === normalizedAbbr
  );
  return fullName || stateAbbr.toLowerCase();
}

export function parseLocationSlug(locationSlug: string): { city: string; state: string } | null {
  const parts = locationSlug.split('-');
  if (parts.length < 2) return null;
  
  const state = parts[parts.length - 1].toUpperCase();
  const city = parts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return { city, state };
}

export function findLocationBySlug(locations: ContactLocation[], locationSlug: string): ContactLocation | null {
  return locations.find(location => {
    const expectedSlug = generateLocationSlug(location.address.city, location.address.state);
    return expectedSlug === locationSlug;
  }) || null;
}

// Location filtering utilities
export function getPhysicalLocations(locations: ContactLocation[]): ContactLocation[] {
  const physicalLocations = locations.filter(location => location.physical_location === true);
  return physicalLocations;
}

export function getVirtualLocations(locations: ContactLocation[]): ContactLocation[] {
  const virtualLocations = locations.filter(location => location.physical_location === false);
  return virtualLocations;
}

export function getMainPhysicalLocation(locations: ContactLocation[]): ContactLocation | null {
  const physicalLocations = getPhysicalLocations(locations);
  return physicalLocations[0] || null;
}

// Simple function to convert 24h to 12h format
export function convertTo12HourFormat(time: string): string {
  if (!time) return "";
  
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;
  
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Formats a US phone number for tel: links
 * Converts "(123) 456-7890" to "+11234567890"
 */
export function formatPhoneForTel(phoneNumber: string): string {
  if (!phoneNumber) return "";
  
  // Remove all non-digits
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // If it's already 11 digits starting with 1, return with +
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  
  // If it's 10 digits, add +1 prefix
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  
  // If it's already formatted with +1, return as is
  if (phoneNumber.startsWith('+1')) {
    return phoneNumber;
  }
  
  // Fallback: try to extract 10 digits and add +1
  const match = phoneNumber.match(/\d{10}/);
  if (match) {
    return `+1${match[0]}`;
  }
  
  return phoneNumber; // Return original if we can't format it
}

/**
 * Formats a US phone number for display
 * Converts "+11234567890" or "1234567890" to "(123) 456-7890"
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  if (!phoneNumber) return "";
  
  // Remove all non-digits
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Handle 11 digits (with country code)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    const areaCode = digitsOnly.slice(1, 4);
    const exchange = digitsOnly.slice(4, 7);
    const number = digitsOnly.slice(7, 11);
    return `(${areaCode}) ${exchange}-${number}`;
  }
  
  // Handle 10 digits (without country code)
  if (digitsOnly.length === 10) {
    const areaCode = digitsOnly.slice(0, 3);
    const exchange = digitsOnly.slice(3, 6);
    const number = digitsOnly.slice(6, 10);
    return `(${areaCode}) ${exchange}-${number}`;
  }
  
  // If already in correct format, return as is
  if (phoneNumber.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
    return phoneNumber;
  }
  
  return phoneNumber; // Return original if we can't format it
}

/**
 * Generates a Google Maps URL for a location address
 * Can include business name for better search results
 */
export function generateGoogleMapsUrl(address: any, businessName?: string): string {
  if (!address) return "#";
  
  // Build the full address string
  const fullAddress = address.full_address || 
    `${address.street}, ${address.city}, ${address.state} ${address.zip_code}`;
  
  // If business name is provided, include it for better search results
  const searchQuery = businessName ? 
    `${businessName} ${fullAddress}` : 
    fullAddress;
  
  return `https://maps.google.com/?q=${encodeURIComponent(searchQuery)}`;
}

/**
 * Generates a neighborhood slug for routing
 * Example: generateNeighborhoodSlug("Los Angeles", "CA", "Hollywood") 
 * Returns: "california/los-angeles/hollywood"
 */
export function generateNeighborhoodSlug(city: string, state: string, neighborhood: string): string {
  const stateFullName = getStateFullName(state);
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const neighborhoodSlug = neighborhood.toLowerCase().replace(/\s+/g, '-');
  return `${stateFullName}/${citySlug}/${neighborhoodSlug}`;
}

/**
 * Finds location by neighborhood slug
 * Example: findLocationByNeighborhoodSlug(locations, "california/los-angeles/hollywood")
 */
export function findSEOLocationByNeighborhoodSlug(seoLocations: SEOLocation[], neighborhoodSlug: string): SEOLocation | null {
  if (!seoLocations || seoLocations.length === 0) {
    return null;
  }
  
  return seoLocations.find(location => {
    if (!location?.address?.neighborhood || location.address.neighborhood.trim() === "") {
      return false;
    }
    const expectedSlug = generateNeighborhoodSlug(
      location.address.city, 
      location.address.state, 
      location.address.neighborhood
    );
    return expectedSlug === neighborhoodSlug;
  }) || null;
}

/**
 * Gets only SEO locations that have neighborhoods
 */
export function getSEOLocationsWithNeighborhoods(seoLocations: SEOLocation[]): SEOLocation[] {
  return seoLocations.filter(location => 
    location.address.neighborhood && 
    location.address.neighborhood.trim() !== ""
  );
}

/**
 * Finds SEO location by city slug
 * Example: findSEOLocationByCitySlug(seoLocations, "california/los-angeles")
 */
export function findSEOLocationByCitySlug(seoLocations: SEOLocation[], citySlug: string): SEOLocation | null {
  if (!seoLocations || seoLocations.length === 0) {
    return null;
  }
  
  return seoLocations.find(location => {
    const expectedSlug = `${getStateFullName(location.address.state)}/${location.address.city.toLowerCase().replace(/\s+/g, '-')}`;
    return expectedSlug === citySlug;
  }) || null;
}

/**
 * Generates breadcrumb data for neighborhood pages using SEOLocation
 */
export function generateNeighborhoodBreadcrumbs(seoLocation: SEOLocation | null) {
  if (!seoLocation) {
    return [
      { label: "Home", href: "/" },
      { label: "Locations", href: "/locations" }
    ];
  }
  
  const stateFullName = getStateFullName(seoLocation.address.state);
  const citySlug = seoLocation.address.city.toLowerCase().replace(/\s+/g, '-');
  const neighborhoodSlug = seoLocation.address.neighborhood.toLowerCase().replace(/\s+/g, '-');
  
  return [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: seoLocation.address.state, href: `/locations/${stateFullName}` },
    { label: seoLocation.address.city, href: `/locations/${stateFullName}/${citySlug}` },
    { label: seoLocation.address.neighborhood, href: `/locations/${stateFullName}/${citySlug}/${neighborhoodSlug}` }
  ];
}
