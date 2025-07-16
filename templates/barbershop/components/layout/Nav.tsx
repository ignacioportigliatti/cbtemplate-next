"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { NavProps } from "@/lib/types";
import Image from "next/image";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";

export const Nav = ({ className, children, id, themeOptions, contactContent }: NavProps) => {
  const { isScrolled } = useScrollPosition();

  return (
    <nav
      className={cn(
        "fixed w-full z-50 top-0 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-background-900/95 backdrop-blur-sm border-b border-border/50 shadow-sm" 
          : "bg-transparent border-b border-transparent",
        className
      )}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-7xl mx-auto px-8 xl:px-0 py-4 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
              src={themeOptions?.general.site_logo.url as string}
              alt="Logo"
              loading="eager"
              className="w-[96px] h-[48px] md:w-[128px] md:h-[64px] object-contain"
              width={128}
              height={64}
            />
        </Link>
        {children}
          <MobileNav themeOptions={themeOptions as ThemeOptions} contactContent={contactContent as ContactContent} />
      </div>
    </nav>
  );
};
