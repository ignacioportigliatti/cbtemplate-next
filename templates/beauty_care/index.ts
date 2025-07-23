// Layout
export { default as Layout, generateMetadata as layoutMetadata } from './pages/Layout';

// Homepage
export { default as HomePage, generateMetadata as homeMetadata } from './pages/HomePage';

// Blog
export { default as BlogPage, generateMetadata as blogMetadata } from './pages/BlogPage';
export { 
  default as BlogPostPage, 
  generateMetadata as blogPostMetadata,
  generateStaticParams as blogPostStaticParams 
} from './pages/BlogPostPage';
export { default as BlogAuthorsPage, generateMetadata as blogAuthorsMetadata } from './pages/BlogAuthorsPage';
export { default as BlogCategoriesPage, generateMetadata as blogCategoriesMetadata } from './pages/BlogCategoriesPage';
export { default as BlogTagsPage, generateMetadata as blogTagsMetadata } from './pages/BlogTagsPage';

// Location Services
export { default as LocationServicesPage } from './pages/LocationServicesPage';
export { default as LocationServiceDetailPage } from './pages/LocationServiceDetailPage';

// Location About
export { default as LocationAboutPage } from './pages/LocationAboutPage';

// Location Contact
export { default as LocationContactPage } from './pages/LocationContactPage';