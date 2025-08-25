import { 
  ContactContent, 
  ServicesContent, 
  ReviewsContent, 
  ThemeOptions,
  Post,
  ContactLocation,
  SEOLocation
} from './wordpress.d';

// Transformar datos de contacto a formato de negocio local
export function transformContactToBusiness(
  contactContent: ContactContent,
  themeOptions: ThemeOptions,
  siteDomain: string
) {
  try {
    const mainLocation = contactContent.locations?.find(location => location.physical_location === true);
    
    if (!mainLocation) {
      return null;
    }

    return {
      name: themeOptions.general.site_name || 'Business Name',
      description: themeOptions.general.site_description || 'Business Description',
      url: siteDomain,
      logo: themeOptions.general.site_logo?.url,
      address: {
        street: mainLocation.address.street || '',
        neighborhood: mainLocation.address.neighborhood || '',
        city: mainLocation.address.city || '',
        state: mainLocation.address.state || '',
        zipCode: mainLocation.address.zip_code || '',
        country: mainLocation.address.country || ''
      },
      contact: {
        phone: mainLocation.phone_number || '',
        email: mainLocation.email || ''
      },
      hours: transformTimetableToHours(mainLocation.timetable),
      priceRange: '$$', // Puede ser configurable desde WordPress
      socialMedia: mainLocation?.social_media ? {
        facebook: mainLocation.social_media.facebook,
        instagram: mainLocation.social_media.instagram,
        google: mainLocation.social_media.google,
        google_reviews: mainLocation.social_media.google_reviews,
        yelp_reviews: mainLocation.social_media.yelp_reviews,
        tripadvisor_reviews: mainLocation.social_media.tripadvisor_reviews,
        linkedin: mainLocation.social_media.linkedin,
        pinterest: mainLocation.social_media.pinterest
      } : undefined
    };
  } catch (error) {
    console.error('Error transforming contact to business:', error);
    return null;
  }
}

// Transformar horarios de WordPress a formato de schema
export function transformTimetableToHours(timetable: any) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return days.reduce((acc, day) => {
    const daySchedule = timetable[day];
    if (daySchedule) {
      acc[day] = {
        isOpen: daySchedule.is_open,
        openTime: daySchedule.is_open ? daySchedule.open_time : undefined,
        closeTime: daySchedule.is_open ? daySchedule.close_time : undefined
      };
    }
    return acc;
  }, {} as Record<string, { isOpen: boolean; openTime?: string; closeTime?: string }>);
}

/**
 * Transform contact data to neighborhood business schema
 * Uses SEOLocation for address/neighborhood data and ContactLocation for contact info
 */
export function transformContactToNeighborhoodBusiness(
  contactContent: ContactContent,
  themeOptions: ThemeOptions,
  siteDomain: string,
  seoLocationData: SEOLocation
) {
  try {
    if (!seoLocationData.address.neighborhood || seoLocationData.address.neighborhood.trim() === "") {
      return null;
    }

    // Get main location for contact data
    const mainLocation = contactContent.locations.find(location => location.physical_location) || contactContent.locations[0];

    return {
      name: `${themeOptions.general.site_name} - ${seoLocationData.address.neighborhood}`,
      description: `${themeOptions.general.site_description} Located in ${seoLocationData.address.neighborhood}, ${seoLocationData.address.city}, ${seoLocationData.address.state}`,
      url: siteDomain,
      logo: themeOptions.general.site_logo?.url,
      address: {
        street: seoLocationData.address.street || '',
        neighborhood: seoLocationData.address.neighborhood || '',
        city: seoLocationData.address.city || '',
        state: seoLocationData.address.state || '',
        zipCode: seoLocationData.address.zip_code || '',
        country: seoLocationData.address.country || ''
      },
      contact: {
        phone: mainLocation?.phone_number || '',
        email: mainLocation?.email || ''
      },
      hours: mainLocation?.timetable ? transformTimetableToHours(mainLocation.timetable) : {},
      priceRange: '$$', // Puede ser configurable desde WordPress
      socialMedia: mainLocation?.social_media ? {
        facebook: mainLocation.social_media.facebook,
        instagram: mainLocation.social_media.instagram,
        google: mainLocation.social_media.google,
        google_reviews: mainLocation.social_media.google_reviews,
        yelp_reviews: mainLocation.social_media.yelp_reviews,
        tripadvisor_reviews: mainLocation.social_media.tripadvisor_reviews,
        linkedin: mainLocation.social_media.linkedin,
        pinterest: mainLocation.social_media.pinterest
      } : undefined,
      // Neighborhood specific data for enhanced local SEO
      areaServed: {
        neighborhood: seoLocationData.address.neighborhood,
        city: seoLocationData.address.city,
        state: seoLocationData.address.state
      }
    };
  } catch (error) {
    console.error('Error transforming contact to neighborhood business:', error);
    return null;
  }
}

// Transformar servicios de WordPress a formato de schema
export function transformServicesToSchema(servicesContent: ServicesContent) {
  try {
    if (!servicesContent.services) return [];
    
    return servicesContent.services.map(service => ({
      name: service.title || 'Service',
      description: service.description || '',
      // Los precios y duración podrían agregarse como campos personalizados en WordPress
      price: undefined, // service.price si se agrega al CMS
      duration: undefined, // service.duration si se agrega al CMS
      image: service.featured_image?.url
    }));
  } catch (error) {
    console.error('Error transforming services to schema:', error);
    return [];
  }
}

// Transformar reseñas de WordPress a formato de schema
export function transformReviewsToSchema(reviewsContent: ReviewsContent) {
  if (!reviewsContent.reviews) return [];
  
  return reviewsContent.reviews.map(review => ({
    author: review.reviewer_name,
    rating: parseInt(review.stars) || 5,
    review: review.review,
    date: new Date().toISOString() // WordPress no tiene fecha de reseña, usar fecha actual
  }));
}

// Transformar artículo de blog a formato de schema
export function transformPostToArticleSchema(post: Post, siteDomain: string) {
  try {
    return {
      title: post.title.rendered || 'Article Title',
      description: post.excerpt.rendered.replace(/<[^>]*>/g, "").trim() || 'Article Description',
      content: post.content.rendered.replace(/<[^>]*>/g, "").trim() || 'Article Content',
      author: "Staff", // Podría obtenerse del autor real
      publishedDate: post.date || new Date().toISOString(),
      modifiedDate: post.modified,
      image: undefined, // post.featured_media?.source_url si se procesa
      url: `${siteDomain}/blog/${post.slug}`
    };
  } catch (error) {
    console.error('Error transforming post to article schema:', error);
    return {
      title: 'Article Title',
      description: 'Article Description',
      content: 'Article Content',
      author: 'Staff',
      publishedDate: new Date().toISOString(),
      url: `${siteDomain}/blog/article`
    };
  }
}

// Transformar datos de organización
export function transformToOrganizationSchema(
  themeOptions: ThemeOptions,
  contactContent: ContactContent,
  siteDomain: string
) {
  const mainLocation = contactContent.locations?.find(location => location.physical_location === true);
  
  return {
    name: themeOptions.general.site_name,
    description: themeOptions.general.site_description,
    url: siteDomain,
    logo: themeOptions.general.site_logo?.url,
    socialMedia: mainLocation?.social_media ? {
      facebook: mainLocation.social_media.facebook,
      instagram: mainLocation.social_media.instagram,
      google: mainLocation.social_media.google,
      linkedin: mainLocation.social_media.linkedin,
      pinterest: mainLocation.social_media.pinterest
    } : undefined
  };
}

// Función helper para obtener datos completos del negocio
export async function getBusinessSchemaData() {
  try {
    const [
      contactContent,
      servicesContent,
      reviewsContent,
      themeOptions
    ] = await Promise.all([
      import('./wordpress').then(m => m.getContactContent()),
      import('./wordpress').then(m => m.getServicesContent()),
      import('./wordpress').then(m => m.getReviewsContent()),
      import('./wordpress').then(m => m.getThemeOptions())
    ]);

    const siteConfig = await import('../site.config').then(m => m.getSiteConfig());
    
    const business = transformContactToBusiness(contactContent, themeOptions, siteConfig.site_domain);
    const services = transformServicesToSchema(servicesContent);
    const reviews = transformReviewsToSchema(reviewsContent);
    const organization = transformToOrganizationSchema(themeOptions, contactContent, siteConfig.site_domain);

    return {
      business,
      services,
      reviews,
      organization
    };
  } catch (error) {
    console.error('Error getting business schema data:', error);
    // Return fallback data instead of null
    return {
      business: null,
      services: [],
      reviews: [],
      organization: null
    };
  }
}
