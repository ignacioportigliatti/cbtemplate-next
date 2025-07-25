import {
  getPostsPaginated,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
  getHomeContent,
  getContactContent,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/templates/beauty_care/components/blog/post-card";
import { FilterPosts } from "@/templates/beauty_care/components/blog/filter";
import { SearchInput } from "@/templates/beauty_care/components/blog/search-input";

import type { Metadata } from "next";
import AboutUsContact from "@/templates/beauty_care/components/about/AboutUsContact";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog Posts",
    description: "Browse all our blog posts",
  };
}

export const dynamic = "auto";
export const revalidate = 600;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  // Handle pagination
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  // Fetch data based on search parameters using efficient pagination
  const [postsResponse, authors, tags, categories] = await Promise.all([
    getPostsPaginated(page, postsPerPage, { author, tag, category, search }),
    search ? searchAuthors(search) : getAllAuthors(),
    search ? searchTags(search) : getAllTags(),
    search ? searchCategories(search) : getAllCategories(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

  // Create pagination URL helper
  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/blog${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const blogContent = (await getHomeContent()).blog;
  const contactContent = (await getContactContent());
  
  return (
    <>
      <Section className="bg-background-950">
        <Container>
          <div className="pt-32 pb-16 max-w-7xl mx-auto">
            <h2 className="text-primary !text-5xl text-center md:text-left font-bold font-heading">
              {blogContent.title}
            </h2>
            <p className="text-muted-foreground/80 mb-8">
              {total} {total === 1 ? "post" : "posts"} found
              {search && " matching your search"}
            </p>

            <div className="space-y-4">
              <SearchInput
                className="bg-background-600/50 rounded-lg"
                defaultValue={search}
              />

              <FilterPosts
                authors={authors}
                tags={tags}
                categories={categories}
                selectedAuthor={author}
                selectedTag={tag}
                selectedCategory={category}
              />
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-3 pt-8 gap-4">
                {posts.map((post) => (
                  <PostCard
                    className="rounded-lg bg-background-900"
                    key={post.id}
                    post={post}
                  />
                ))}
              </div>
            ) : (
              <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
                <p>No posts found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center py-8">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPaginationUrl(page - 1)} />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((pageNum) => {
                        // Show current page, first page, last page, and 2 pages around current
                        return (
                          pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1
                        );
                      })
                      .map((pageNum, index, array) => {
                        const showEllipsis = index > 0 && pageNum - array[index - 1] > 1;
                        return (
                          <div
                            key={pageNum}
                            className="flex items-center"
                          >
                            {showEllipsis && <span className="px-2">...</span>}
                            <PaginationItem>
                              <PaginationLink
                                href={createPaginationUrl(pageNum)}
                                isActive={pageNum === page}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}

                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPaginationUrl(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </Container>
      </Section>
      {/* Contact Info */}
      <section className="bg-background-900 py-16 px-4 lg:px-8">
        <AboutUsContact contactContent={contactContent} />
      </section>
    </>
  );
}
