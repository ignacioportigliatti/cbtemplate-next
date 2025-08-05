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

  // Get the main location (index 0)
  const mainLocation = contactContent.locations?.[0];
  
  // Generate location-based menu items using only the main location
  const generateLocationMenu = () => {
    if (!mainLocation) {
      return mainMenu; // Fallback to original menu
    }

    const locationSlug = generateLocationSlug(mainLocation.address.city, mainLocation.address.state);
    return {
      home: "/",
      about: `/${locationSlug}/about`,
      services: `/${locationSlug}/services`,
      contact: `/${locationSlug}/contact`,
      blog: "/blog",
    };
  };

  const locationMenu = generateLocationMenu();

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
                      {themeOptions?.general?.site_logo?.url ? (
          <Image
            src={themeOptions?.general?.site_logo?.url as string}
                  alt="Logo"
                  width={128}
                  height={64}
                />
              ) : (
                <span>{themeOptions?.general?.site_name || "Site Name"}</span>
              )}
            </MobileLink>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-20rem)] pb-10 pl-2">
          <div className="flex flex-col space-y-1">
            {/* Direct links for all menu items */}
            {Object.entries(locationMenu).map(([key, href]) => (
              <MobileLink
                key={key}
                href={href}
                onOpenChange={setOpen}
                className="text-3xl hover:text-primary transition-all duration-300 font-heading text-text"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="flex flex-col gap-1">
          <div className="flex flex-col gap-2 text-xs">
            {mainLocation?.phone_number && (
              <div className="flex items-center gap-2">
                <FaPhone className="w-4 h-4" />
                <p className="text-muted-foreground/80">{mainLocation.phone_number}</p>
              </div>
            )}
            {mainLocation?.email && (
              <div className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                <p className="text-muted-foreground/80">{mainLocation.email}</p>
              </div>
            )}
            {mainLocation?.address && (
              <div className="flex items-center gap-2">
                <FaMapPin className="w-4 h-4" />
                <p className="text-muted-foreground/80">
                  {mainLocation.address.full_address || 
                   `${mainLocation.address.street}, ${mainLocation.address.city}, ${mainLocation.address.state} ${mainLocation.address.zip_code}, ${mainLocation.address.country}`}
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
