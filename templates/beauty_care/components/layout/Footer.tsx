import Image from "next/image";
import { Container, Section } from "@/components/craft";
import Link from "next/link";
import { contentMenu, mainMenu } from "@/templates/beauty_care/menu.config";
import { ContactContent, ThemeOptions } from "@/lib/wordpress.d";

interface FooterProps {
  themeOptions: ThemeOptions;
  contactContent: ContactContent;
}

export const Footer = ({ themeOptions, contactContent }: FooterProps) => {
  return (
    <footer className="">
      <Section className="bg-background-800 px-6 sm:px-8 py-8 lg:py-16">
        <Container className="md:grid flex flex-col-reverse max-w-7xl mx-auto md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
          <div className="flex md:flex-col flex-col-reverse gap-2 justify-between items-center md:items-start not-prose">
            <Link href="/">
              <h3 className="sr-only">{themeOptions?.general.site_name}</h3>
              {themeOptions?.general.site_logo && (
                <Image
                  src={themeOptions?.general.site_logo.url as string}
                  alt="Logo"
                  className="w-[96px] h-[48px] md:w-[128px] md:h-[64px] object-contain"
                  width={128}
                  height={64}
                ></Image>
              )}
            </Link>

            <div>
              <p className="text-muted-foreground/50 text-sm mt-2 w-full text-center md:text-left">
                {themeOptions?.general.site_description}
              </p>
              <p className="text-muted-foreground/50 text-center md:text-left text-xs mt-1 w-full">
                &copy; Made by <a href="https://chilledbutter.com">Chilled Butter</a>. All rights
                reserved. 2025-present.
              </p>
            </div>
          </div>
          <div className="flex gap-24 text-sm">
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Website</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Blog</h5>
            {Object.entries(contentMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
