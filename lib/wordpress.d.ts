// Common types that are reused across multiple entities
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: {
    rendered: string;
  };
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

// Media types
interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// WordPress Image Info Interface (for ACF image fields)
export interface WordpressImageInfo {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    "thumbnail-width": number;
    "thumbnail-height": number;
    medium: string;
    "medium-width": number;
    "medium-height": number;
    medium_large: string;
    "medium_large-width": number;
    "medium_large-height": number;
    large: string;
    "large-width": number;
    "large-height": number;
    "1536x1536": string;
    "1536x1536-width": number;
    "1536x1536-height": number;
    "2048x2048": string;
    "2048x2048-width": number;
    "2048x2048-height": number;
  };
}

// Content types
export interface Post extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
  | "standard"
  | "aside"
  | "chat"
  | "gallery"
  | "link"
  | "image"
  | "quote"
  | "status"
  | "video"
  | "audio";
  categories: number[];
  tags: number[];
  meta: Record<string, unknown>;
}

export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
}

// Taxonomy types
interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  meta: Record<string, unknown>;
}

export interface Category extends Taxonomy {
  taxonomy: "category";
  parent: number;
}

export interface Tag extends Taxonomy {
  taxonomy: "post_tag";
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta: Record<string, unknown>;
}

// Block types
interface BlockSupports {
  align?: boolean | string[];
  anchor?: boolean;
  className?: boolean;
  color?: {
    background?: boolean;
    gradients?: boolean;
    text?: boolean;
  };
  spacing?: {
    margin?: boolean;
    padding?: boolean;
  };
  typography?: {
    fontSize?: boolean;
    lineHeight?: boolean;
  };
  [key: string]: unknown;
}

interface BlockStyle {
  name: string;
  label: string;
  isDefault: boolean;
}

export interface BlockType {
  api_version: number;
  title: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
  parent: string[];
  supports: BlockSupports;
  styles: BlockStyle[];
  textdomain: string;
  example: Record<string, unknown>;
  attributes: Record<string, unknown>;
  provides_context: Record<string, string>;
  uses_context: string[];
  editor_script: string;
  script: string;
  editor_style: string;
  style: string;
}

export interface EditorBlock {
  id: string;
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks: EditorBlock[];
  innerHTML: string;
  innerContent: string[];
}

export interface TemplatePart {
  id: string;
  slug: string;
  theme: string;
  type: string;
  source: string;
  origin: string;
  content: string | EditorBlock[];
  title: {
    raw: string;
    rendered: string;
  };
  description: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  wp_id: number;
  has_theme_file: boolean;
  author: number;
  area: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links: {
    self: Array<{
      embeddable: boolean;
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
  };
}

// Component Props Types
export interface FilterBarProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: Author["id"];
  selectedTag?: Tag["id"];
  selectedCategory?: Category["id"];
  onAuthorChange?: (authorId: Author["id"] | undefined) => void;
  onTagChange?: (tagId: Tag["id"] | undefined) => void;
  onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}

// Home Page Content Types
interface ButtonConfig {
  label: string;
  link: string;
}

interface SocialLinks {
  facebook: string;
  google: string;
  instagram: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export interface HomePageContent {
  hero: {
    subtitle: string;
    title: string;
    description: string;
    button: ButtonConfig;
    gallery: WordpressImageInfo[];
  };
  popular_services: {
    subtitle: string;
    title: string;
    button: ButtonConfig;
    services_to_display: number;
  };
  reviews: {
    title: string;
    reviews_to_display: number;
  };
  faq: {
    title: string;
    questions: FAQItem[];
  };
  blog: {
    title: string;
    subtitle: string;
    posts_to_display: number;
  };
}

// Service types
interface ServiceItem {
  title: string;
  description: string;
  featured_image: WordpressImageInfo | null;
  gallery: WordpressImageInfo[] | null;
  slug: string;
  service_page_content: string;
}

export interface ServicesContent {
  page_info: {
    subtitle: string;
    title: string;
    description: string;
    button: ButtonConfig;
  };
  services: ServiceItem[];
}

// Reviews types
interface ReviewItem {
  stars: string;
  reviewer_name: string;
  review: string;
  google_verified?: boolean;
  profile_photo_url?: string;
  review_date?: string;
}

export interface ReviewsContent {
  page_info: {
    subtitle: string;
    title: string;
    description: string;
  };
  reviews: ReviewItem[];
}

// Contact Content Types
interface ContactAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  full_address?: string;
}

interface ContactSocialMedia {
  facebook?: string;
  instagram?: string;
  google?: string;
  google_reviews?: string;
  yelp_reviews?: string;
  tripadvisor_reviews?: string;
  linkedin?: string;
  pinterest?: string;
}

interface ContactTimetableDay {
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface ContactTimetable {
  monday: ContactTimetableDay;
  tuesday: ContactTimetableDay;
  wednesday: ContactTimetableDay;
  thursday: ContactTimetableDay;
  friday: ContactTimetableDay;
  saturday: ContactTimetableDay;
  sunday: ContactTimetableDay;
}

interface ContactLocation {
  id: string;
  name: string;
  physical_location: boolean;
  address: ContactAddress;
  phone_number?: string;
  email?: string;
  social_media: ContactSocialMedia;
  timetable: ContactTimetable;
}

interface SEOLocation {
  id: string;
  name: string;
  address: ContactAddress;
}

interface ContactPageInfo {
  subtitle?: string;
  title?: string;
  description?: string;
}

export interface ContactContent {
  page_info: ContactPageInfo;
  locations: ContactLocation[];
  seo_locations: SEOLocation[];
}

// Additional types for contact updates
export interface ContactUpdateRequest {
  page_info?: ContactPageInfo;
  locations?: ContactLocation[];
}

export interface ContactUpdateResponse {
  success: boolean;
  message: string;
  updated_fields: Record<string, any>;
}

export interface ThemeColors {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  border_color: string;
  muted_color: string;
  destructive_color: string;
}

export interface ThemeOptions {
  general: {
    site_name: string;
    site_description: string;
    site_logo: WordpressImageInfo;
    site_icon?: WordpressImageInfo;
    ctaHeader?: boolean;
    cta_type?: "chilled_butter_widget" | "default_form";
    cta_script_tag?: string;
    header_scripts?: {
      scripts: Array<{
        id: string;
        name: string;
        code: string;
        active: boolean;
      }>;
    };
  };
  colors: ThemeColors;
  templates: ThemeTemplates;
}

export interface ThemeTemplates {
  available_templates: {
    [key: string]: {
      id: string;
      name: string;
      description: string;
      preview_image: string;
    }
  },
  selected_template: string;
  selected_template_details: {
    id: string;
    name: string;
    description: string;
    preview_image: string;
  }
}

interface TeamMember {
  member_name: string;
  member_position: string;
  member_description: string;
  member_photo: WordpressImageInfo;
  member_facebook: string;
  member_instagram: string;
  member_google: string;
  member_linkedin: string;
}

// Team Page Info interface
interface TeamPageInfo {
  subtitle: string;
  title: string;
  description: string;
}

// Complete Team Content interface
interface TeamContent {
  page_info: TeamPageInfo;
  members: TeamMember[];
}

// About Value interface
interface AboutValue {
  title: string;
  description: string;
}

// About Story/Mission interface
interface AboutSection {
  title: string;
  content: string;
}

// About Values interface
interface AboutValues {
  title: string;
  list: AboutValue[];
}

// About Page Info interface
interface AboutPageInfo {
  subtitle: string;
  title: string;
  description: string;
}

// Complete About Content interface
export interface AboutUsContent {
  page_info: AboutPageInfo;
  story: AboutSection;
  mission: AboutSection;
  values: AboutValues;
  gallery: WordpressImageInfo[];
}
