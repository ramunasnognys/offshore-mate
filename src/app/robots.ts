import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '@/lib/seo/constants'

/**
 * Generate robots.txt for the Offshore Mate application
 * Using Next.js 15 native robots.txt generation
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.siteUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Disallow API routes
          '/admin/', // Disallow admin routes (if they exist)
          '/_next/', // Disallow Next.js internal files
          '/404', // Disallow error pages
          '/500',
          '/temp/', // Disallow temporary files
          '*.json$', // Disallow direct JSON file access
        ],
        crawlDelay: 1, // Be respectful to smaller crawlers
      },
      
      // Specific rules for major search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
        ],
        // No crawl delay for Google - they can handle it
      },
      
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
        ],
        crawlDelay: 2, // Bing prefers slightly slower crawling
      },
      
      // Block problematic or resource-heavy bots
      {
        userAgent: [
          'CCBot', // Common Crawl
          'GPTBot', // OpenAI
          'ChatGPT-User', // OpenAI ChatGPT
          'CCBot', // Common Crawl
          'anthropic-ai', // Anthropic
          'Claude-Web', // Anthropic Claude
        ],
        disallow: '/', // Block AI training crawlers
      },
      
      // Allow social media crawlers for sharing
      {
        userAgent: [
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
    ],
    
    // Link to our dynamic sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
    
    // Additional sitemaps if we have them
    host: baseUrl,
  };
}

/**
 * Generate environment-specific robots.txt
 * This could be used in development/staging environments
 */
export function generateDevelopmentRobots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/', // Block all crawlers in development
      },
    ],
    sitemap: 'http://localhost:3000/sitemap.xml',
  };
}

/**
 * Generate production robots.txt with additional optimizations
 */
export function generateProductionRobots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/404',
          '/500',
          '*.json$',
          '/temp/',
          '/cache/',
          '/uploads/',
        ],
        crawlDelay: 1,
      },
      
      // Enhanced rules for production
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/rotation/',
          '/s/', // Allow shared schedules
          '/help',
          '/about',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/temp/',
        ],
      },
      
      // Image-specific crawler rules
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/og-image.png',
          '/favicon.ico',
          '*.png$',
          '*.jpg$',
          '*.jpeg$',
          '*.gif$',
          '*.webp$',
          '*.svg$',
        ],
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
      
      // Mobile-specific crawler
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
        ],
      },
      
      // Block resource-intensive crawlers
      {
        userAgent: [
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'SemrushBot',
        ],
        crawlDelay: 10, // Much slower crawling for SEO tools
        disallow: [
          '/api/',
          '/s/', // Block shared schedules from SEO crawlers
        ],
      },
      
      // Completely block problematic bots
      {
        userAgent: [
          'CCBot',
          'GPTBot',
          'ChatGPT-User',
          'anthropic-ai',
          'Claude-Web',
          'PiplBot',
          'Bytespider', // TikTok crawler
        ],
        disallow: '/',
      },
    ],
    
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Add additional sitemaps if needed
      // `${baseUrl}/sitemap-images.xml`,
      // `${baseUrl}/sitemap-schedules.xml`,
    ],
    
    host: baseUrl,
  };
}