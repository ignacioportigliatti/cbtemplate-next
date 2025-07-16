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
        <div className="flex items-center gap-2">
          {/* <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button
                key={href}
                asChild
                className="text-white hover:text-amber-400 hover:bg-amber-800"
                variant="ghost"
                size="sm"
              >
                <Link key={key} href={href}>{key.charAt(0).toUpperCase() + key.slice(1)}</Link>
              </Button>
            ))}
          </div>
          <Button
            asChild
            className="hidden sm:flex"
          >
            <Link href="#">Get Started</Link>
          </Button> */}
          <MobileNav themeOptions={themeOptions as ThemeOptions} contactContent={contactContent as ContactContent} />
        </div>
      </div>
    </nav>
  );
};
