import Image from "next/image";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { contentMenu, mainMenu } from "@/templates/barbershop/menu.config";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { getMainPhysicalLocation, getStateFullName, formatPhoneForTel, formatPhoneForDisplay, generateGoogleMapsUrl } from "@/lib/utils";
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

export const Footer = ({ themeOptions, contactContent }: FooterProps) => {
  // Get the main location for contact info (phone, email, social media)
  const mainLocation = getMainPhysicalLocation(contactContent.locations || []);
  
  // Get all SEO locations for location links
  const seoLocations = contactContent.seo_locations || [];
  
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
      <Section className="bg-background-800 px-6 sm:px-8 py-8 lg:py-16">
        <Container className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <h4 className="sr-only">{themeOptions?.general?.site_name || "Site Name"}</h4>
                {themeOptions?.general?.site_logo?.url && (
                  <Image
                    src={themeOptions?.general?.site_logo?.url as string}
                    alt="Logo"
                    className="w-[96px] h-[48px] md:w-[128px] md:h-[64px] object-contain"
                    width={128}
                    height={64}
                  />
                )}
              </Link>
              <p className="text-muted-foreground/70 text-sm mb-4">
                {themeOptions?.general.site_description}
              </p>
              
              {/* Contact Info */}
              {mainLocation && (
                <div className="space-y-3">
                  {mainLocation.phone_number && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-4 h-4 text-primary" />
                      <Link 
                        href={`tel:${formatPhoneForTel(mainLocation.phone_number)}`} 
                        className="text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                      >
                        {formatPhoneForDisplay(mainLocation.phone_number)}
                      </Link>
                    </div>
                  )}
                  {mainLocation.email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-primary" />
                      <Link 
                        href={`mailto:${mainLocation.email}`} 
                        className="text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                      >
                        {mainLocation.email}
                      </Link>
                    </div>
                  )}
                  {mainLocation?.address && (
                    <div className="flex items-start gap-2">
                      <FaMapMarker className="w-4 h-4 text-primary mt-0.5" />
                      <Link 
                        href={generateGoogleMapsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/70 hover:text-primary transition-colors text-sm"
                      >
                        {mainLocation.address.full_address || 
                         `${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}`}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Website Links */}
            <div className="lg:col-span-1">
              <h5 className="font-medium text-base text-text mb-4 tracking-[0.2em] uppercase font-heading">Website</h5>
              <div className="space-y-2">
                {Object.entries(menu).map(([key, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm tracking-[0.1em] uppercase"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Link>
                ))}
                
                {/* Location-specific links for all SEO locations */}
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
                      key={`${seoLocation.address.city}-${seoLocation.address.state}-${seoLocation.address.neighborhood || 'no-neighborhood'}`}
                      href={href}
                      className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm tracking-[0.1em] uppercase"
                    >
                      {displayText}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Blog Links */}
            <div className="lg:col-span-1">
              <h5 className="font-medium text-base text-text mb-4 tracking-[0.2em] uppercase font-heading">Blog</h5>
              <div className="space-y-2">
                {Object.entries(contentMenu).map(([key, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-muted-foreground/70 hover:text-primary transition-colors text-sm tracking-[0.1em] uppercase"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media & Reviews */}
            <div className="lg:col-span-1">
              <h5 className="font-medium text-base text-text mb-4 tracking-[0.2em] uppercase font-heading">Connect With Us</h5>
              
              {/* Social Media */}
              {mainLocation?.social_media && (
                <div className="mb-6">
                  <h6 className="text-sm font-medium text-muted-foreground/80 mb-3 tracking-[0.1em] uppercase">Follow Us</h6>
                  <div className="flex gap-3">
                    {Object.entries(mainLocation.social_media)
                      .filter(([key, value]) => value && value.trim() !== "")
                      .map(([key, value]) => {
                        const Icon = socialIcons[key as keyof typeof socialIcons];
                        if (!Icon) return null;
                        
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
                <div>
                  <h6 className="text-sm font-medium text-muted-foreground/80 mb-3 tracking-[0.1em] uppercase">Leave a Review</h6>
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
