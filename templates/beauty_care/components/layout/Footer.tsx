import Image from "next/image";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { contentMenu, mainMenu } from "@/templates/beauty_care/menu.config";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { getMainPhysicalLocation, getStateFullName, formatPhoneForTel, formatPhoneForDisplay, generateGoogleMapsUrl } from "@/lib/utils";
import { getAllPages } from "@/lib/wordpress";
import { 
  FaEnvelope, 
  FaFacebook, 
  FaGoogle, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarker, 
  FaPhone, 
  FaPinterest, 
  FaStar,
  FaYelp,
  FaTripadvisor
} from "react-icons/fa";

interface FooterProps {
  themeOptions: ThemeOptions;
  contactContent: ContactContent;
}

// Rutas reservadas que no son páginas personalizadas
const reservedRoutes = ["blog", "about", "contact", "services", "team", "reviews"];

export const Footer = async ({ themeOptions, contactContent }: FooterProps) => {
  // Get the main location for contact info (phone, email, social media)
  const mainLocation = getMainPhysicalLocation(contactContent.locations || []);
  
  // Get all SEO locations for location links
  const seoLocations = contactContent.seo_locations || [];
  
  // Get custom pages from WordPress
  const allPages = await getAllPages();
  const customPages = allPages.filter((page) => !reservedRoutes.includes(page.slug));
  
  // Generate menu items using the new structure
  const generateMenu = () => {
    return {
      home: "/",
      about: "/about",
      services: "/services",
      contact: "/contact",
      blog: "/blog",
    };
  };

  const menu = generateMenu();

  // Generate Google Maps URL for address using main location
  const generateGoogleMapsUrl = () => {
    if (!mainLocation) return "#";
    
    const address = mainLocation.address.full_address || 
      `${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}`;
    
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  };

  // Social media icons mapping
  const socialIcons = {
    facebook: <FaFacebook className="w-5 h-5" />,
    instagram: <FaInstagram className="w-5 h-5" />,
    linkedin: <FaLinkedin className="w-5 h-5" />,
    google: <FaGoogle className="w-5 h-5" />,
    pinterest: <FaPinterest className="w-5 h-5" />,
  };

  // Review platform icons
  const reviewIcons = {
    google: <FaGoogle className="w-5 h-5" />,
    yelp: <FaYelp className="w-5 h-5" />,
    tripadvisor: <FaTripadvisor className="w-5 h-5" />,
  };

  return (
    <footer className="">
      <Section className="bg-background-900 px-6 sm:px-8 py-8 lg:py-16">
        <Container className="max-w-7xl mx-auto">
          {/* Main Footer Content - Four Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
            
            {/* Column 1: Company Info */}
            <div className="space-y-2">
              <Link href="/" className="inline-block">
                {themeOptions?.general?.site_logo?.url ? (
                  <Image
                    src={themeOptions?.general?.site_logo?.url as string}
                    alt={themeOptions?.general?.site_name || "Logo"}
                    className="w-[96px] h-[48px] md:w-[128px] md:h-[64px] object-contain"
                    width={128}
                    height={128}
                  />
                ) : (
                  <h3 className="text-xl font-bold text-primary">
                    {themeOptions?.general?.site_name || "Site Name"}
                  </h3>
                )}
              </Link>
              
              <p className="text-muted-foreground/70 text-sm leading-relaxed">
                {themeOptions?.general?.site_description}
              </p>
              
              {/* Social Media Icons */}
              {mainLocation?.social_media && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground/70 text-sm leading-relaxed">Follow us on</span>
                <div className="flex gap-3">
                  {Object.entries(mainLocation.social_media)
                    .filter(([key, value]) => value && value.trim() !== "" && socialIcons[key as keyof typeof socialIcons])
                    .map(([key, value]) => {
                      const Icon = socialIcons[key as keyof typeof socialIcons];
                      return (
                        <Link
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground/70 hover:text-primary transition-colors"
                          aria-label={`Follow us on ${key}`}
                        >
                          {Icon}
                        </Link>
                      );
                    })}
                </div>
                </div>
              )}

              {/* Review Links */}
              {(mainLocation?.social_media?.google_reviews || mainLocation?.social_media?.yelp_reviews || mainLocation?.social_media?.tripadvisor_reviews) && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground/70 text-sm leading-relaxed">Review us on</span>
                <div className="flex gap-3">
                  {mainLocation?.social_media?.google_reviews && (
                    <Link
                      href={mainLocation.social_media.google_reviews}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/70 hover:text-primary transition-colors"
                      aria-label="Review us on Google"
                    >
                      <FaGoogle className="w-5 h-5" />
                    </Link>
                  )}
                  {mainLocation?.social_media?.yelp_reviews && (
                    <Link
                      href={mainLocation.social_media.yelp_reviews}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/70 hover:text-primary transition-colors"
                      aria-label="Review us on Yelp"
                    >
                      <FaYelp className="w-5 h-5" />
                    </Link>
                  )}
                  {mainLocation?.social_media?.tripadvisor_reviews && (
                    <Link
                      href={mainLocation.social_media.tripadvisor_reviews}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/70 hover:text-primary transition-colors"
                      aria-label="Review us on TripAdvisor"
                    >
                      <FaTripadvisor className="w-5 h-5" />
                    </Link>
                  )}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Menu */}
            <div className="space-y-4">
              <h5 className="font-medium text-base text-text font-heading">Menu</h5>
              <div className="space-y-2">
                {Object.entries(menu).map(([key, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Blog */}
            <div className="space-y-4">
              <h5 className="font-medium text-base text-text font-heading">Blog</h5>
              <div className="space-y-2">
                <Link href="/blog" className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm">
                  All Posts
                </Link>
                {Object.entries(contentMenu).map(([key, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 4: Locations & Other Pages */}
            <div className="space-y-6">
              {/* Locations Section */}
              {seoLocations.length > 0 && (
                <div className="space-y-4">
                <h5 className="font-medium text-base text-text font-heading">Locations</h5>
                <div className="space-y-2">
                  {seoLocations.map((seoLocation, index) => {
                    const hasNeighborhood = seoLocation.address.neighborhood && seoLocation.address.neighborhood.trim() !== '';
                    const displayText = hasNeighborhood 
                      ? `${seoLocation.address.neighborhood}, ${seoLocation.address.city}, ${seoLocation.address.state}`
                      : `${seoLocation.address.city}, ${seoLocation.address.state}`;
                    
                    const href = hasNeighborhood
                      ? `/locations/${getStateFullName(seoLocation.address.state)}/${seoLocation.address.city.toLowerCase().replace(/\s+/g, '-')}/${seoLocation.address.neighborhood.toLowerCase().replace(/\s+/g, '-')}`
                      : `/locations/${getStateFullName(seoLocation.address.state)}/${seoLocation.address.city.toLowerCase().replace(/\s+/g, '-')}`;
                    
                    return (
                      <Link
                        key={`${seoLocation.address.city}-${seoLocation.address.state}-${seoLocation.address.neighborhood || `no-neighborhood-${index}`}`}
                        href={href}
                        className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                      >
                        {displayText}
                      </Link>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Other Pages Section */}
              <div className="space-y-4">
                {customPages && customPages.length > 0 && (
                  <h5 className="font-medium text-base text-text font-heading">Other Pages</h5>
                )}
                <div className="space-y-2">
                  {/* Custom pages from WordPress /pages/ route */}
                  {customPages && customPages.length > 0 && customPages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/pages/${page.slug}`}
                      className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                    >
                      {page.title.rendered}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-muted-foreground/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground/50 text-xs text-center md:text-left">
                &copy; {new Date().getFullYear()} {themeOptions?.general?.site_name || "Site Name"}. All rights reserved.
              </p>
              <p className="text-muted-foreground/50 text-xs text-center md:text-right">
                Made by <a href="https://chilledbutter.com" className="hover:text-primary transition-colors">Chilled Butter</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
