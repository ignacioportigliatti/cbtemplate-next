"use client";

import { Input } from "@/components/ui/input";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput({ defaultValue, className }: { defaultValue?: string, className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      type="text"
      name="search"
      className={className}
      placeholder="Search posts..."
      defaultValue={defaultValue}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
