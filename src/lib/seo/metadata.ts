import { Metadata } from 'next';
import { 
  DynamicMetadataProps, 
  EnhancedMetadata, 
  OpenGraphData, 
  TwitterCardData,
  SEOPageType 
} from '@/types/seo';
import { RotationPattern } from '@/types/rotation';
import { SEO_CONFIG, SEO_TEMPLATES, SOCIAL_CONFIG, IMAGE_OPTIMIZATION } from './constants';

/**
 * Generate comprehensive metadata for any page type
 */
export function generateMetadata(props: DynamicMetadataProps): Metadata {
  const {
    rotationPattern,
    startDate,
    scheduleName,
    scheduleId,
    pageType,
    customTitle,
    customDescription
  } = props;

  const baseMetadata = getBaseMetadata(pageType);
  const dynamicMetadata = generateDynamicMetadata(props);

  // Merge base and dynamic metadata
  const metadata: Metadata = {
    ...baseMetadata,
    ...dynamicMetadata,
    
    // Generate Open Graph metadata
    openGraph: generateOpenGraphMetadata(props),
    
    // Generate Twitter Card metadata  
    twitter: generateTwitterMetadata(props),
    
    // Additional metadata
    keywords: generateKeywords(pageType, rotationPattern),
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.organization.name,
    
    // Canonical URL
    alternates: {
      canonical: generateCanonicalUrl(pageType, scheduleId)
    },
    
    // Robots directive
    robots: {
      index: shouldIndexPage(pageType),
      follow: true,
      googleBot: {
        index: shouldIndexPage(pageType),
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Additional metadata for better SEO
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    category: 'Business Application',
  };

  return metadata;
}

/**
 * Get base metadata for page type
 */
function getBaseMetadata(pageType: SEOPageType): Metadata {
  const template = SEO_TEMPLATES[pageType] || SEO_TEMPLATES.homepage;
  
  return {
    title: {
      template: template.titleTemplate || `%s | ${SEO_CONFIG.siteName}`,
      default: template.title || SEO_CONFIG.defaultTitle
    },
    description: template.description || SEO_CONFIG.defaultDescription,
  };
}

/**
 * Generate dynamic metadata based on props
 */
function generateDynamicMetadata(props: DynamicMetadataProps): Partial<Metadata> {
  const { rotationPattern, startDate, scheduleName, customTitle, customDescription, pageType } = props;
  
  let title = customTitle;
  let description = customDescription;
  
  // Generate rotation-specific metadata
  if (rotationPattern && !title) {
    title = generateRotationTitle(rotationPattern, scheduleName, startDate);
  }
  
  if (rotationPattern && !description) {
    description = generateRotationDescription(rotationPattern, startDate);
  }
  
  // Generate page-type specific metadata
  if (pageType === 'shared-schedule' && scheduleName) {
    title = `${scheduleName} - Shared Offshore Schedule`;
    description = `View and import this ${rotationPattern || 'offshore work'} rotation schedule. Professional calendar with export options.`;
  }
  
  return {
    title: title || undefined,
    description: description || undefined
  };
}

/**
 * Generate Open Graph metadata
 */
function generateOpenGraphMetadata(props: DynamicMetadataProps): OpenGraphData {
  const { rotationPattern, scheduleName, pageType, customTitle } = props;
  
  let title = customTitle || generateRotationTitle(rotationPattern, scheduleName);
  let description = generateRotationDescription(rotationPattern);
  
  if (pageType === 'homepage') {
    title = SEO_CONFIG.defaultTitle;
    description = SEO_CONFIG.defaultDescription;
  }
  
  return {
    title,
    description,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    type: 'website',
    locale: 'en_US',
    images: [{
      url: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultImage}`,
      width: IMAGE_OPTIMIZATION.ogImageSize.width,
      height: IMAGE_OPTIMIZATION.ogImageSize.height,
      alt: `${SEO_CONFIG.siteName} - Professional Offshore Work Rotation Calendar Generator`,
      type: 'image/png'
    }]
  };
}

/**
 * Generate Twitter Card metadata
 */
function generateTwitterMetadata(props: DynamicMetadataProps): TwitterCardData {
  const openGraphData = generateOpenGraphMetadata(props);
  
  return {
    card: SOCIAL_CONFIG.twitter.card,
    site: SOCIAL_CONFIG.twitter.site,
    creator: SOCIAL_CONFIG.twitter.site,
    title: openGraphData.title,
    description: openGraphData.description,
    images: openGraphData.images.map(img => img.url)
  };
}

/**
 * Generate rotation-specific title
 */
function generateRotationTitle(
  rotationPattern?: RotationPattern, 
  scheduleName?: string,
  startDate?: string
): string {
  if (!rotationPattern) return SEO_CONFIG.defaultTitle;
  
  const baseTitle = scheduleName || `${rotationPattern} Rotation Calendar`;
  const dateInfo = startDate ? ` - Starting ${new Date(startDate).toLocaleDateString()}` : '';
  
  return `${baseTitle}${dateInfo}`;
}

/**
 * Generate rotation-specific description
 */
function generateRotationDescription(rotationPattern?: RotationPattern, startDate?: string): string {
  if (!rotationPattern) return SEO_CONFIG.defaultDescription;
  
  const rotationDescriptions = {
    '14/14': '14 days on, 14 days off rotation schedule. Perfect for offshore oil & gas workers with standard 2-week cycles.',
    '14/21': '14 days on, 21 days off rotation calendar. Ideal for workers with extended time off periods.',
    '21/21': '21 days on, 21 days off rotation schedule. Perfect for long-term offshore assignments with equal work and rest periods.',
    '28/28': '28 days on, 28 days off rotation calendar. Ideal for extended offshore assignments with monthly cycles.',
    'Custom': 'Custom offshore work rotation schedule tailored to your specific pattern and requirements.'
  };
  
  const baseDescription = rotationDescriptions[rotationPattern];
  const dateInfo = startDate ? ` Starting ${new Date(startDate).toLocaleDateString()}.` : '';
  const suffix = ' Generate professional calendars with export to PNG, PDF, and iCal formats.';
  
  return `${baseDescription}${dateInfo}${suffix}`;
}

/**
 * Generate keywords based on page type and rotation
 */
function generateKeywords(pageType: SEOPageType, rotationPattern?: RotationPattern): string[] {
  let keywords = [...SEO_CONFIG.keywords];
  
  // Add rotation-specific keywords
  if (rotationPattern) {
    keywords = keywords.concat([
      `${rotationPattern} rotation`,
      `${rotationPattern} schedule`,
      `${rotationPattern} calendar`,
      rotationPattern.includes('14') ? 'two week rotation' : '',
      rotationPattern.includes('21') ? 'three week rotation' : '',
      rotationPattern.includes('28') ? 'monthly rotation' : ''
    ].filter(Boolean));
  }
  
  // Add page-specific keywords
  const pageKeywords = {
    'homepage': ['offshore calendar generator', 'work rotation planner'],
    'calendar-generator': ['calendar generation', 'schedule creator'],
    'shared-schedule': ['shared calendar', 'schedule import', 'calendar sharing'],
    'rotation-pattern': ['rotation patterns', 'work schedules'],
    'about': ['about offshore mate', 'calendar tool'],
    'help': ['help guide', 'calendar instructions']
  };
  
  if (pageKeywords[pageType]) {
    keywords = keywords.concat(pageKeywords[pageType]);
  }
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate canonical URL
 */
function generateCanonicalUrl(pageType: SEOPageType, scheduleId?: string): string {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  switch (pageType) {
    case 'homepage':
      return baseUrl;
    case 'shared-schedule':
      return scheduleId ? `${baseUrl}/s/${scheduleId}` : baseUrl;
    default:
      return baseUrl;
  }
}

/**
 * Determine if page should be indexed
 */
function shouldIndexPage(pageType: SEOPageType): boolean {
  // Don't index shared schedule pages for now (can be changed later)
  return pageType !== 'shared-schedule';
}

/**
 * Generate metadata for shared schedule pages
 */
export function generateSharedScheduleMetadata(
  scheduleId: string,
  rotationPattern: RotationPattern,
  scheduleName?: string,
  startDate?: string
): Metadata {
  return generateMetadata({
    pageType: 'shared-schedule',
    scheduleId,
    rotationPattern,
    scheduleName,
    startDate
  });
}

/**
 * Generate metadata for rotation pattern pages
 */
export function generateRotationPatternMetadata(rotationPattern: RotationPattern): Metadata {
  return generateMetadata({
    pageType: 'rotation-pattern',
    rotationPattern
  });
}

/**
 * Get default homepage metadata
 */
export function getHomepageMetadata(): Metadata {
  return generateMetadata({ pageType: 'homepage' });
}

/**
 * Utility to merge metadata objects
 */
export function mergeMetadata(base: Metadata, override: Partial<Metadata>): Metadata {
  return {
    ...base,
    ...override,
    openGraph: {
      ...base.openGraph,
      ...override.openGraph
    },
    twitter: {
      ...base.twitter,
      ...override.twitter
    }
  };
}