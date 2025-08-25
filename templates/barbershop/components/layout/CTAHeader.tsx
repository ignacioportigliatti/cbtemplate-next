"use client";

import { cn } from "@/lib/utils";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { getMainPhysicalLocation, formatPhoneForTel, formatPhoneForDisplay } from "@/lib/utils";
import Link from "next/link";

interface CTAHeaderProps {
  contactContent: ContactContent;
  themeOptions?: ThemeOptions;
}

export const CTAHeader = ({ contactContent, themeOptions }: CTAHeaderProps) => {
  const { isScrolled } = useScrollPosition();
  const primaryLocation = getMainPhysicalLocation(contactContent.locations || []);

  if (!primaryLocation) return null;

  // Determine CTA type from theme options
  const ctaType = themeOptions?.general?.cta_type || "default_form";
  const showEmail = ctaType === "default_form";

  const contactInfo = {
    icon: <FaPhone className="w-4 h-4" />,
    text: formatPhoneForDisplay(primaryLocation.phone_number || "(555) 123-4567"),
    href: `tel:${formatPhoneForTel(primaryLocation.phone_number || "(555) 123-4567")}`
  };

  const emailInfo = {
    icon: <FaEnvelope className="w-4 h-4" />,
    text: primaryLocation.email || "info@example.com",
    href: `mailto:${primaryLocation.email || "info@example.com"}`
  };

  return (
    <div
      className={cn(
        "fixed w-full z-40 top-0 transition-all duration-300 ease-in-out bg-background-800 text-accent-foreground h-12",
        isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-8 xl:px-0 h-full flex justify-between items-center text-sm">
        <Link
          href={contactInfo.href}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {contactInfo.icon}
          <span className="hidden sm:inline">{contactInfo.text}</span>
        </Link>
        
        {showEmail ? (
          <Link
            href={emailInfo.href}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {emailInfo.icon}
            <span className="hidden sm:inline">{emailInfo.text}</span>
          </Link>
        ) : (
          <button
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 p-1 px-2 rounded transition-colors text-sm cb-widget-btn"
            onClick={() => console.log('Book Now button clicked - class:', 'cb-widget-btn')}
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};
