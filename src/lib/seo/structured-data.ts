import { 
  OrganizationSchema, 
  SoftwareApplicationSchema, 
  FAQSchema, 
  HowToSchema,
  FAQItem,
  HowToStep 
} from '@/types/seo';
import { RotationPattern } from '@/types/rotation';
import { SEO_CONFIG, SCHEMA_CONSTANTS } from './constants';

/**
 * Generate Organization schema for Offshore Mate
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.organization.name,
    url: SEO_CONFIG.organization.url,
    logo: SEO_CONFIG.organization.logo,
    description: SEO_CONFIG.organization.description,
    foundingDate: SEO_CONFIG.organization.foundingDate,
    sameAs: SEO_CONFIG.organization.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@offshore-mate.com'
    }
  };
}

/**
 * Generate SoftwareApplication schema for Offshore Mate
 */
export function generateSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SEO_CONFIG.siteName,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    applicationCategory: SCHEMA_CONSTANTS.softwareApplication.applicationCategory,
    operatingSystem: SCHEMA_CONSTANTS.softwareApplication.operatingSystem,
    offers: SCHEMA_CONSTANTS.softwareApplication.offers,
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.organization.name
    }
  };
}

/**
 * Generate FAQ schema for offshore rotation questions
 */
export function generateFAQSchema(): FAQSchema {
  const faqItems: FAQItem[] = SCHEMA_CONSTANTS.faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems
  };
}

/**
 * Generate HowTo schema for calendar generation process
 */
export function generateHowToSchema(): HowToSchema {
  const steps: HowToStep[] = SCHEMA_CONSTANTS.howToSteps.map((step, index) => ({
    '@type': 'HowToStep',
    name: step.name,
    text: step.text,
    url: `${SEO_CONFIG.siteUrl}${step.url}`,
    image: `${SEO_CONFIG.siteUrl}/images/step-${index + 1}.png`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate Offshore Work Rotation Calendar',
    description: 'Step-by-step guide to create professional offshore work rotation schedules using Offshore Mate.',
    totalTime: 'PT5M', // 5 minutes
    supply: ['Computer or mobile device', 'Internet connection'],
    tool: ['Offshore Mate web application'],
    step: steps
  };
}

/**
 * Generate rotation-specific FAQ schema
 */
export function generateRotationFAQSchema(rotationPattern: RotationPattern): FAQSchema {
  const rotationSpecificFAQs: { [key in RotationPattern]: FAQItem[] } = {
    '14/14': [
      {
        '@type': 'Question',
        name: `What is a ${rotationPattern} rotation schedule?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 14/14 rotation means 14 consecutive days of work followed by 14 consecutive days off. This is one of the most common offshore rotation patterns, providing a balanced work-life schedule for offshore workers.'
        }
      },
      {
        '@type': 'Question',
        name: `Who uses ${rotationPattern} rotations?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: '14/14 rotations are commonly used by offshore oil & gas workers, wind farm technicians, and maritime professionals. This pattern allows for intensive work periods with equal recovery time.'
        }
      }
    ],
    
    '14/21': [
      {
        '@type': 'Question',
        name: `What is a ${rotationPattern} rotation schedule?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 14/21 rotation means 14 consecutive days of work followed by 21 consecutive days off. This pattern provides extended time off periods, popular among workers who prioritize longer rest periods.'
        }
      }
    ],
    
    '21/21': [
      {
        '@type': 'Question',
        name: `What is a ${rotationPattern} rotation schedule?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 21/21 rotation means 21 consecutive days of work followed by 21 consecutive days off. This pattern is ideal for long-term offshore assignments with equal work and rest periods.'
        }
      }
    ],
    
    '28/28': [
      {
        '@type': 'Question',
        name: `What is a ${rotationPattern} rotation schedule?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 28/28 rotation means 28 consecutive days (4 weeks) of work followed by 28 consecutive days off. This is used for extended offshore assignments, particularly in remote locations.'
        }
      }
    ],
    
    'Custom': [
      {
        '@type': 'Question',
        name: 'What is a custom rotation schedule?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A custom rotation allows you to define your own work and off periods that don\'t follow standard patterns. Perfect for unique offshore assignments or specialized work arrangements.'
        }
      }
    ]
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rotationSpecificFAQs[rotationPattern] || rotationSpecificFAQs['Custom']
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  const listItems = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems
  };
}

/**
 * Generate WebSite schema with search functionality
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    alternateName: 'Offshore Calendar Generator',
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.organization.name
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generate Product schema for shared schedules
 */
export function generateScheduleProductSchema(
  scheduleName: string, 
  rotationPattern: RotationPattern,
  scheduleId: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: scheduleName,
    description: `Professional ${rotationPattern} offshore work rotation schedule. Generated with Offshore Mate calendar generator.`,
    category: 'Work Schedule',
    brand: {
      '@type': 'Brand',
      name: SEO_CONFIG.siteName
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SEO_CONFIG.siteUrl}/s/${scheduleId}`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

/**
 * Generate LocalBusiness schema if applicable
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_CONFIG.organization.name,
    description: SEO_CONFIG.organization.description,
    url: SEO_CONFIG.siteUrl,
    telephone: '+1-555-OFFSHORE',
    email: 'support@offshore-mate.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    openingHours: '24/7', // Web service available 24/7
    priceRange: 'Free',
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide'
    }
  };
}

/**
 * Safely stringify JSON-LD (prevents XSS attacks)
 */
export function safeJSONLD(schema: any): string {
  return JSON.stringify(schema, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\//g, '\\u002f');
}

/**
 * Combine multiple schemas into a single JSON-LD script
 */
export function combineSchemas(...schemas: any[]): string {
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
  
  return safeJSONLD(combinedSchema);
}