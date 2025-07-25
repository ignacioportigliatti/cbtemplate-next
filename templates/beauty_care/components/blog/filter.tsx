"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Ensure this is the correct import path
import { Button } from "@/components/ui/button"; // Add this import for the Button component

interface Author {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface FilterPostsProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
}

export function FilterPosts({
  authors,
  tags,
  categories,
  selectedAuthor,
  selectedTag,
  selectedCategory,
}: FilterPostsProps) {
  const router = useRouter();

  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} -> ${value}`);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("page");
    value === "all" ? newParams.delete(type) : newParams.set(type, value);

    router.push(`/blog?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/blog");
  };

  const hasTags = tags.length > 0;
  const hasCategories = categories.length > 0;
  const hasAuthors = authors.length > 0;

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value) => handleFilterChange("tag", value)}
      >
        <SelectTrigger className="bg-background-600/50 rounded-lg" disabled={!hasTags}>
          {hasTags ? <SelectValue placeholder="All Tags" /> : "No tags found"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id.toString()}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger className="bg-background-600/50 rounded-lg" disabled={!hasCategories}>
          {hasCategories ? (
            <SelectValue placeholder="All Categories" />
          ) : (
            "No categories found"
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedAuthor || "all"}
        onValueChange={(value) => handleFilterChange("author", value)}
      >
        <SelectTrigger className="bg-background-600/50 text-center rounded-lg" disabled={!hasAuthors}>
          {hasAuthors ? (
            <SelectValue placeholder="All Authors" />
          ) : (
            "No authors found"
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author.id} value={author.id.toString()}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" className="rounded-lg bg-background-600/50" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}
