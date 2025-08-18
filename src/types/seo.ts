import { Metadata } from 'next';
import { RotationPattern } from './rotation';

// Enhanced metadata interface extending Next.js Metadata
export interface EnhancedMetadata extends Metadata {
  // Custom properties for Offshore Mate
  rotationPattern?: RotationPattern;
  startDate?: string;
  scheduleId?: string;
}

// Open Graph specific types
export interface OpenGraphData {
  title: string;
  description: string;
  url: string;
  siteName: string;
  images: OpenGraphImage[];
  type: 'website' | 'article';
  locale?: string;
}

export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

// Twitter Card specific types
export interface TwitterCardData {
  card: 'summary' | 'summary_large_image';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  images?: string[];
}

// SEO page types for different sections
export type SEOPageType = 
  | 'homepage'
  | 'calendar-generator' 
  | 'shared-schedule'
  | 'rotation-pattern'
  | 'about'
  | 'help';

// Dynamic metadata generation props
export interface DynamicMetadataProps {
  rotationPattern?: RotationPattern;
  startDate?: string;
  scheduleName?: string;
  scheduleId?: string;
  pageType: SEOPageType;
  customTitle?: string;
  customDescription?: string;
}

// Structured data schema types
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  contactPoint?: ContactPoint;
  sameAs?: string[];
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType: string;
  email?: string;
}

export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency?: string;
  };
  author?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: FAQItem[];
}

export interface FAQItem {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface HowToSchema {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  step: HowToStep[];
}

export interface HowToStep {
  '@type': 'HowToStep';
  name: string;
  text: string;
  url?: string;
  image?: string;
}

// SEO audit types
export interface SEOAuditResult {
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  technicalSEO: TechnicalSEOAudit;
  contentSEO: ContentSEOAudit;
  performanceSEO: PerformanceSEOAudit;
}

export interface SEOIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'technical' | 'content' | 'performance' | 'mobile' | 'accessibility';
  title: string;
  description: string;
  fix?: string;
  impact: string;
}

export interface SEORecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  implementation: string;
  expectedImpact: string;
}

export interface TechnicalSEOAudit {
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasStructuredData: boolean;
  hasCanonicalUrls: boolean;
  metaTagsOptimized: boolean;
  urlStructureOptimized: boolean;
  httpsEnabled: boolean;
}

export interface ContentSEOAudit {
  titleOptimized: boolean;
  metaDescriptionOptimized: boolean;
  headingStructureValid: boolean;
  contentQuality: number; // 0-100
  keywordOptimization: number; // 0-100
  imageAltTextPresent: boolean;
}

export interface PerformanceSEOAudit {
  coreWebVitals: CoreWebVitalsScore;
  imageOptimization: number; // 0-100
  loadingSpeed: number; // 0-100
  mobileOptimized: boolean;
}

export interface CoreWebVitalsScore {
  lcp: number; // Largest Contentful Paint (ms)
  inp: number; // Interaction to Next Paint (ms) 
  cls: number; // Cumulative Layout Shift
  overallScore: 'good' | 'needs-improvement' | 'poor';
}

// SEO configuration
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
  keywords: string[];
  author: string;
  organization: OrganizationSchema;
}

// Sitemap types
export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Robots.txt types
export interface RobotsConfig {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  sitemap?: string;
}

// International SEO types
export interface HreflangEntry {
  hreflang: string;
  href: string;
}

export interface LocaleMetadata {
  locale: string;
  title: string;
  description: string;
  keywords?: string[];
}

// Export utility types
export type SEOOptimizationLevel = 'basic' | 'standard' | 'advanced' | 'enterprise';
export type SEOMetric = 'visibility' | 'traffic' | 'rankings' | 'ctr' | 'conversions';

// Validation types
export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}