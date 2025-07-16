import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 mx-2" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
} 