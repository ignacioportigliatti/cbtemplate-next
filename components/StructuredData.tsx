import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Componente específico para LocalBusiness
export function LocalBusinessSchema({ 
  business, 
  services, 
  reviews 
}: {
  business: {
    name: string;
    description: string;
    url: string;
    logo?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    contact: {
      phone: string;
      email?: string;
    };
    hours: {
      [key: string]: {
        isOpen: boolean;
        openTime?: string;
        closeTime?: string;
      };
    };
    priceRange?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      google?: string;
      linkedin?: string;
      pinterest?: string;
    };
  };
  services?: Array<{
    name: string;
    description: string;
    price?: string;
    duration?: string;
  }>;
  reviews?: Array<{
    author: string;
    rating: number;
    review: string;
    date?: string;
  }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": business.url,
    ...(business.logo && { "image": business.logo }),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.street,
      "addressLocality": business.address.city,
      "addressRegion": business.address.state,
      "postalCode": business.address.zipCode,
      "addressCountry": business.address.country
    },
    "telephone": business.contact.phone,
    ...(business.contact.email && { "email": business.contact.email }),
    "openingHours": formatOpeningHours(business.hours),
    ...(business.priceRange && { "priceRange": business.priceRange }),
    ...(business.socialMedia && {
      "sameAs": Object.values(business.socialMedia).filter(Boolean)
    }),
    ...(services && services.length > 0 && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            ...(service.price && { "price": service.price }),
            ...(service.duration && { "timeRequired": service.duration })
          }
        }))
      }
    }),
    ...(reviews && reviews.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": calculateAverageRating(reviews),
        "reviewCount": reviews.length,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5,
          "worstRating": 1
        },
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewBody": review.review,
        ...(review.date && { "datePublished": review.date })
      }))
    })
  };

  return <StructuredData data={schema} />;
}

// Componente para servicios individuales
export function ServiceSchema({
  service,
  business
}: {
  service: {
    name: string;
    description: string;
    price?: string;
    duration?: string;
    image?: string;
  };
  business: {
    name: string;
    url: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    ...(service.image && { "image": service.image }),
    ...(service.price && { "price": service.price }),
    ...(service.duration && { "timeRequired": service.duration }),
    "provider": {
      "@type": "LocalBusiness",
      "name": business.name,
      "url": business.url,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address.street,
        "addressLocality": business.address.city,
        "addressRegion": business.address.state,
        "postalCode": business.address.zipCode,
        "addressCountry": business.address.country
      }
    }
  };

  return <StructuredData data={schema} />;
}

// Componente para artículos de blog
export function ArticleSchema({
  article
}: {
  article: {
    title: string;
    description: string;
    content: string;
    author: string;
    publishedDate: string;
    modifiedDate?: string;
    image?: string;
    url: string;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "articleBody": article.content,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.publishedDate,
    ...(article.modifiedDate && { "dateModified": article.modifiedDate }),
    ...(article.image && { "image": article.image }),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };

  return <StructuredData data={schema} />;
}

// Componente para organización
export function OrganizationSchema({
  organization
}: {
  organization: {
    name: string;
    description: string;
    url: string;
    logo?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      google?: string;
      linkedin?: string;
      pinterest?: string;
    };
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "description": organization.description,
    "url": organization.url,
    ...(organization.logo && { "logo": organization.logo }),
    ...(organization.socialMedia && {
      "sameAs": Object.values(organization.socialMedia).filter(Boolean)
    })
  };

  return <StructuredData data={schema} />;
}

// Funciones auxiliares
function formatOpeningHours(hours: Record<string, { isOpen: boolean; openTime?: string; closeTime?: string }>): string[] {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayAbbreviations = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  return days.map((day, index) => {
    const dayHours = hours[day];
    if (dayHours?.isOpen && dayHours.openTime && dayHours.closeTime) {
      return `${dayAbbreviations[index]} ${dayHours.openTime}-${dayHours.closeTime}`;
    }
    return null;
  }).filter(Boolean) as string[];
}

function calculateAverageRating(reviews: Array<{ rating: number }>): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10; // Redondear a 1 decimal
}
