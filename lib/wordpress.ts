// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
  HomePageContent,
  ServicesContent,
  ReviewsContent,
  ContactContent,
  ThemeColors,
  ThemeOptions,
  TeamContent,
  AboutUsContent,
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  console.error("WORDPRESS_URL environment variable is not defined - using fallback data");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
  if (!baseUrl) {
    throw new WordPressAPIError(
      "WordPress URL not configured",
      500,
      path
    );
  }

  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  if (!baseUrl) {
    throw new WordPressAPIError(
      "WordPress URL not configured",
      500,
      path
    );
  }

  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts"];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  // Add page-specific cache tag for granular invalidation
  cacheTags.push(`posts-page-${page}`);

  const url = `${baseUrl}/wp-json/wp/v2/posts${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  try {
    const query: Record<string, any> = {
      _embed: true,
      per_page: 100,
    };

    if (filterParams?.search) {
      query.search = filterParams.search;

      if (filterParams?.author) {
        query.author = filterParams.author;
      }
      if (filterParams?.tag) {
        query.tags = filterParams.tag;
      }
      if (filterParams?.category) {
        query.categories = filterParams.category;
      }
    } else {
      if (filterParams?.author) {
        query.author = filterParams.author;
      }
      if (filterParams?.tag) {
        query.tags = filterParams.tag;
      }
      if (filterParams?.category) {
        query.categories = filterParams.category;
      }
    }

    return await wordpressFetch<Post[]>("/wp-json/wp/v2/posts", query);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug }).then(
    (posts) => posts[0]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories");
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags");
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug }).then(
    (pages) => pages[0]
  );
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<Post[]>(
      "/wp-json/wp/v2/posts",
      {
        per_page: 100,
        page,
        _fields: "slug", // Only fetch slug field for performance
      }
    );

    const posts = response.data;
    allSlugs.push(...posts.map((post) => ({ slug: post.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getHomeContent(): Promise<HomePageContent> {
  try {
    return await wordpressFetch<HomePageContent>("wp-json/wp/v2/content/homepage");
  } catch (error) {
    console.error('Error fetching home content:', error);
    // Return fallback data for build time
    return {
      hero: {
        title: "Welcome",
        subtitle: "Your Business",
        description: "Professional services you can trust",
        gallery: [],
        button: {
          label: "Learn More",
          link: "/about"
        }
      },
      popular_services: {
        subtitle: "Quality",
        title: "Our Services",
        button: {
          label: "View All Services",
          link: "/services"
        },
        services_to_display: 3
      },
      reviews: {
        title: "What Our Clients Say",
        reviews_to_display: 3
      },
      faq: {
        title: "Frequently Asked Questions",
        questions: []
      },
      blog: {
        title: "Latest News",
        subtitle: "Blog",
        posts_to_display: 3
      }
    } as HomePageContent;
  }
}

export async function getServicesContent(): Promise<ServicesContent> {
  try {
    return await wordpressFetch<ServicesContent>("wp-json/wp/v2/content/services");
  } catch (error) {
    console.error('Error fetching services content:', error);
    return {
      page_info: {
        subtitle: "Services",
        title: "Our Services",
        description: "Professional services for you",
        button: {
          label: "Contact Us",
          link: "/contact"
        }
      },
      services: []
    } as ServicesContent;
  }
}

export async function getReviewsContent(): Promise<ReviewsContent> {
  try {
    return await wordpressFetch<ReviewsContent>("wp-json/wp/v2/content/reviews");
  } catch (error) {
    console.error('Error fetching reviews content:', error);
    return {
      page_info: {
        subtitle: "Reviews",
        title: "What Our Clients Say",
        description: "Client testimonials"
      },
      reviews: []
    } as ReviewsContent;
  }
}

export async function getContactContent(): Promise<ContactContent> {
  try {
    return await wordpressFetch<ContactContent>("wp-json/wp/v2/content/contact");
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return {
      page_info: {
        subtitle: "Contact",
        title: "Get in Touch",
        description: "We'd love to hear from you"
      },
      locations: []
    } as ContactContent;
  }
}

export async function getThemeOptions(): Promise<ThemeOptions> {
  try {
    return await wordpressFetch<ThemeOptions>("wp-json/wp/v2/theme-options");
  } catch (error) {
    console.error('Error fetching theme options:', error);
    return {
      general: {
        site_name: "Your Business",
        site_description: "Professional services",
        site_logo: {} as any
      },
      colors: {
        primary_color: "#007bff",
        secondary_color: "#6c757d",
        accent_color: "#28a745",
        background_color: "#ffffff",
        text_color: "#212529",
        border_color: "#dee2e6",
        muted_color: "#6c757d",
        destructive_color: "#dc3545"
      },
      templates: {
        available_templates: {},
        selected_template: "barbershop",
        selected_template_details: {
          id: "barbershop",
          name: "Barbershop",
          description: "Default template",
          preview_image: ""
        }
      }
    } as ThemeOptions;
  }
}

export async function getTeamContent(): Promise<TeamContent> {
  try {
    return await wordpressFetch<TeamContent>("wp-json/wp/v2/content/team");
  } catch (error) {
    console.error('Error fetching team content:', error);
    return {
      page_info: {
        subtitle: "Team",
        title: "Meet Our Team",
        description: "Our professional team"
      },
      members: []
    } as TeamContent;
  }
}

export async function getAboutUsContent(): Promise<AboutUsContent> {
  try {
    return await wordpressFetch<AboutUsContent>("wp-json/wp/v2/content/about");
  } catch (error) {
    console.error('Error fetching about content:', error);
    // Return fallback data for build time
    return {
      page_info: {
        subtitle: "About",
        title: "About Us",
        description: "Learn more about our company"
      },
      story: {
        title: "Our Story",
        content: "We are a professional company dedicated to excellence"
      },
      mission: {
        title: "Our Mission",
        content: "We are committed to providing excellent service"
      },
      values: {
        title: "Our Values", 
        list: []
      },
      gallery: []
    } as AboutUsContent;
  }
}

export { WordPressAPIError };
