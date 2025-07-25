"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

// Utility Imports
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateLocationSlug } from "@/lib/utils";

// Component Imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { mainMenu } from "@/templates/barbershop/menu.config";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";
import Image from "next/image";
import { FaEnvelope, FaMapPin, FaPhone } from "react-icons/fa";

interface MobileNavProps {
  themeOptions: ThemeOptions;
  contactContent: ContactContent;
}

export function MobileNav({ themeOptions, contactContent }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  // Generate location-based menu items
  const generateLocationMenu = () => {
    const locations = contactContent.locations || [];
    
    if (locations.length === 0) {
      return mainMenu; // Fallback to original menu
    }

    if (locations.length === 1) {
      // Single location - direct links
      const locationSlug = generateLocationSlug(locations[0].address.city, locations[0].address.state);
      return {
        home: "/",
        about: `/${locationSlug}/about`,
        services: `/${locationSlug}/services`,
        contact: `/${locationSlug}/contact`,
        blog: "/blog",
      };
    }

    // Multiple locations - return original menu for mobile (will be handled by accordion)
    return mainMenu;
  };

  const locationMenu = generateLocationMenu();
  const hasMultipleLocations = (contactContent.locations || []).length > 1;

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col justify-between w-full min-w-[480px]"
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setOpen}
            >
              {themeOptions?.general.site_logo.url ? (
                <Image
                  src={themeOptions?.general.site_logo.url as string}
                  alt="Logo"
                  width={128}
                  height={64}
                />
              ) : (
                <span>{themeOptions?.general.site_name}</span>
              )}
            </MobileLink>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-20rem)] pb-10 pl-2">
          <div className="flex flex-col space-y-1">
            {hasMultipleLocations ? (
              // Multiple locations - use accordion
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(mainMenu).map(([key, href]) => {
                  if (key === 'home' || key === 'blog') {
                    // Direct links for home and blog
                    return (
                      <MobileLink
                        key={key}
                        href={href}
                        onOpenChange={setOpen}
                        className="text-3xl hover:text-primary transition-all duration-300 font-heading text-text"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </MobileLink>
                    );
                  }

                  // Location-based items with accordion
                  return (
                    <AccordionItem key={key} value={key} className="border-none">
                      <AccordionTrigger className="text-3xl hover:text-primary transition-all duration-300 font-heading text-text py-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-4">
                          {contactContent.locations.map((location) => {
                            const locationSlug = generateLocationSlug(location.address.city, location.address.state);
                            const locationHref = `/${locationSlug}/${key}`;
                            
                            return (
                              <MobileLink
                                key={location.id}
                                href={locationHref}
                                onOpenChange={setOpen}
                                className="text-xl hover:text-primary transition-all duration-300 font-heading text-text"
                              >
                                {location.address.city}, {location.address.state}
                              </MobileLink>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              // Single location - direct links
              Object.entries(locationMenu).map(([key, href]) => (
                <MobileLink
                  key={key}
                  href={href}
                  onOpenChange={setOpen}
                  className="text-3xl hover:text-primary transition-all duration-300 font-heading text-text"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </MobileLink>
              ))
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="flex flex-col gap-1">
          <div className="flex flex-col gap-2 text-xs">
            {contactContent.locations?.[0]?.phone_number && (
              <div className="flex items-center gap-2">
                <FaPhone className="w-4 h-4" />
                <p className="text-muted-foreground/80">{contactContent.locations[0].phone_number}</p>
              </div>
            )}
            {contactContent.locations?.[0]?.email && (
              <div className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                <p className="text-muted-foreground/80">{contactContent.locations[0].email}</p>
              </div>
            )}
            {contactContent.locations?.[0]?.address && (
              <div className="flex items-center gap-2">
                <FaMapPin className="w-4 h-4" />
                <p className="text-muted-foreground/80">
                  {contactContent.locations[0].address.full_address || 
                   `${contactContent.locations[0].address.street}, ${contactContent.locations[0].address.city}, ${contactContent.locations[0].address.state} ${contactContent.locations[0].address.zip_code}, ${contactContent.locations[0].address.country}`}
                </p>
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
