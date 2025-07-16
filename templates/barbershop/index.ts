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

// Services
export { default as ServicesPage, generateMetadata as servicesMetadata } from './pages/ServicesPage';
export { 
  default as ServiceDetailPage, 
  generateMetadata as serviceDetailMetadata,
  generateStaticParams as serviceDetailStaticParams 
} from './pages/ServiceDetailPage';

// About
export { default as AboutPage, generateMetadata as aboutMetadata } from './pages/AboutPage';

// Contact
export { default as ContactPage, generateMetadata as contactMetadata } from './pages/ContactPage';