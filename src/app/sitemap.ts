import { MetadataRoute } from 'next'
import { SEO_CONFIG, SITEMAP_CONFIG } from '@/lib/seo/constants'
import { RotationPattern } from '@/types/rotation'

// Define the available rotation patterns
const ROTATION_PATTERNS: RotationPattern[] = ['14/14', '14/21', '21/21', '28/28'];

/**
 * Generate dynamic sitemap for the Offshore Mate application
 * Using Next.js 15 native sitemap generation
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl;
  const currentDate = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: SITEMAP_CONFIG.changeFrequency,
      priority: SITEMAP_CONFIG.priority.homepage,
    },
    
    // Static pages
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: SITEMAP_CONFIG.priority.staticPages,
    },
    
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: SITEMAP_CONFIG.priority.staticPages,
    },
    
    // Calendar generator page (if exists as separate route)
    {
      url: `${baseUrl}/calendar`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: SITEMAP_CONFIG.priority.rotationPages,
    }
  ];

  // Add rotation pattern specific pages
  ROTATION_PATTERNS.forEach((pattern) => {
    // Main rotation pattern pages
    sitemapEntries.push({
      url: `${baseUrl}/rotation/${pattern.toLowerCase().replace('/', '-')}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: SITEMAP_CONFIG.priority.rotationPages,
    });
    
    // Pattern-specific help/info pages
    sitemapEntries.push({
      url: `${baseUrl}/rotation/${pattern.toLowerCase().replace('/', '-')}/info`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: SITEMAP_CONFIG.priority.staticPages,
    });
  });

  // Add dynamic shared schedule pages (example URLs)
  // Note: In a real implementation, you'd fetch these from your database
  // For now, we'll add some example patterns that could be dynamically generated
  const exampleSharedSchedules = generateExampleSharedSchedules();
  
  exampleSharedSchedules.forEach((schedule) => {
    sitemapEntries.push({
      url: `${baseUrl}/s/${schedule.id}`,
      lastModified: schedule.lastModified,
      changeFrequency: 'yearly', // Shared schedules don't change often
      priority: SITEMAP_CONFIG.priority.sharedSchedules,
    });
  });

  // Add API documentation if it exists
  sitemapEntries.push({
    url: `${baseUrl}/api/docs`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: SITEMAP_CONFIG.priority.staticPages,
  });

  // Add legal pages
  const legalPages = ['privacy', 'terms', 'cookies'];
  legalPages.forEach((page) => {
    sitemapEntries.push({
      url: `${baseUrl}/${page}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    });
  });

  // Sort entries by priority (highest first)
  return sitemapEntries.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Generate example shared schedules for sitemap
 * In production, this would fetch from your database/storage
 */
function generateExampleSharedSchedules() {
  const examples = [
    {
      id: 'north-sea-14-14',
      pattern: '14/14' as RotationPattern,
      name: 'North Sea 14/14 Rotation',
      lastModified: new Date('2024-01-15')
    },
    {
      id: 'gulf-mexico-21-21',
      pattern: '21/21' as RotationPattern,  
      name: 'Gulf of Mexico 21/21 Rotation',
      lastModified: new Date('2024-02-01')
    },
    {
      id: 'offshore-wind-14-21',
      pattern: '14/21' as RotationPattern,
      name: 'Offshore Wind 14/21 Rotation',
      lastModified: new Date('2024-03-10')
    }
  ];

  return examples;
}

/**
 * Generate sitemap for specific rotation pattern
 * This could be used for more granular sitemap generation
 */
export function generateRotationPatternSitemap(pattern: RotationPattern): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl;
  const currentDate = new Date();
  const patternSlug = pattern.toLowerCase().replace('/', '-');

  return [
    {
      url: `${baseUrl}/rotation/${patternSlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: SITEMAP_CONFIG.priority.rotationPages,
    },
    {
      url: `${baseUrl}/rotation/${patternSlug}/examples`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/rotation/${patternSlug}/calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  ];
}