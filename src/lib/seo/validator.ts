import { SEOValidationResult } from '@/types/seo';

/**
 * Comprehensive SEO Validator for Offshore Mate
 * Validates SEO implementations against best practices and standards
 */
export class SEOValidator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://offshore-mate.vercel.app') {
    this.baseUrl = baseUrl;
  }

  /**
   * Run comprehensive SEO validation
   */
  async validateAll(): Promise<ComprehensiveValidationResult> {
    console.log('🔍 Starting comprehensive SEO validation...');
    
    const results: ComprehensiveValidationResult = {
      overall: { isValid: false, errors: [], warnings: [], suggestions: [] },
      metadata: await this.validateMetadata(),
      structuredData: await this.validateStructuredData(),
      technicalSEO: await this.validateTechnicalSEO(),
      performance: await this.validatePerformance(),
      accessibility: await this.validateAccessibility(),
      content: await this.validateContent()
    };

    // Calculate overall validity
    results.overall = this.calculateOverallResult(results);
    
    console.log(`✅ Validation completed: ${results.overall.isValid ? 'PASSED' : 'FAILED'}`);
    return results;
  }

  /**
   * Validate metadata implementation
   */
  async validateMetadata(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();

      // Validate title tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (!titleMatch) {
        errors.push('Missing title tag');
      } else {
        const titleLength = titleMatch[1].length;
        if (titleLength < 30) {
          warnings.push(`Title too short (${titleLength} chars). Recommended: 30-60 chars`);
        } else if (titleLength > 60) {
          warnings.push(`Title too long (${titleLength} chars). Recommended: 30-60 chars`);
        }
      }

      // Validate meta description
      const descMatch = html.match(/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/i);
      if (!descMatch) {
        errors.push('Missing meta description');
      } else {
        const descLength = descMatch[1].length;
        if (descLength < 120) {
          warnings.push(`Meta description too short (${descLength} chars). Recommended: 120-160 chars`);
        } else if (descLength > 160) {
          warnings.push(`Meta description too long (${descLength} chars). Recommended: 120-160 chars`);
        }
      }

      // Validate Open Graph tags
      const ogTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
      const missingOG = ogTags.filter(tag => !html.includes(`property="${tag}"`));
      if (missingOG.length > 0) {
        warnings.push(`Missing Open Graph tags: ${missingOG.join(', ')}`);
      }

      // Validate Twitter Card tags
      const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
      const missingTwitter = twitterTags.filter(tag => !html.includes(`name="${tag}"`));
      if (missingTwitter.length > 0) {
        suggestions.push(`Consider adding Twitter Card tags: ${missingTwitter.join(', ')}`);
      }

      // Validate canonical URL
      if (!html.includes('rel="canonical"')) {
        warnings.push('Missing canonical URL');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to fetch page for metadata validation'],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Validate structured data implementation
   */
  async validateStructuredData(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();

      // Extract JSON-LD scripts
      const jsonLdMatches = html.match(/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/gis);
      
      if (!jsonLdMatches || jsonLdMatches.length === 0) {
        errors.push('No JSON-LD structured data found');
        return { isValid: false, errors, warnings, suggestions };
      }

      // Validate each JSON-LD block
      for (let i = 0; i < jsonLdMatches.length; i++) {
        const scriptContent = jsonLdMatches[i].replace(/<script[^>]*>|<\/script>/gi, '');
        
        try {
          const schema = JSON.parse(scriptContent);
          const validationResult = this.validateSchemaObject(schema);
          
          errors.push(...validationResult.errors);
          warnings.push(...validationResult.warnings);
          suggestions.push(...validationResult.suggestions);
          
        } catch (parseError) {
          errors.push(`Invalid JSON in structured data block ${i + 1}`);
        }
      }

      // Check for essential schema types
      const hasOrganization = html.includes('"@type":"Organization"');
      const hasSoftwareApplication = html.includes('"@type":"SoftwareApplication"');
      const hasWebSite = html.includes('"@type":"WebSite"');

      if (!hasOrganization) {
        suggestions.push('Consider adding Organization schema for better brand recognition');
      }
      if (!hasSoftwareApplication) {
        suggestions.push('Consider adding SoftwareApplication schema for app categorization');
      }
      if (!hasWebSite) {
        suggestions.push('Consider adding WebSite schema with search functionality');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate structured data'],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Validate technical SEO elements
   */
  async validateTechnicalSEO(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate robots.txt
    try {
      const robotsResponse = await fetch(`${this.baseUrl}/robots.txt`);
      if (!robotsResponse.ok) {
        errors.push('robots.txt not accessible');
      } else {
        const robotsContent = await robotsResponse.text();
        if (!robotsContent.includes('User-agent:')) {
          warnings.push('robots.txt may be improperly formatted');
        }
        if (!robotsContent.includes('Sitemap:')) {
          suggestions.push('Consider adding sitemap reference to robots.txt');
        }
      }
    } catch (error) {
      errors.push('Failed to fetch robots.txt');
    }

    // Validate sitemap.xml
    try {
      const sitemapResponse = await fetch(`${this.baseUrl}/sitemap.xml`);
      if (!sitemapResponse.ok) {
        errors.push('sitemap.xml not accessible');
      } else {
        const sitemapContent = await sitemapResponse.text();
        if (!sitemapContent.includes('<urlset') && !sitemapContent.includes('<sitemapindex')) {
          errors.push('Sitemap does not appear to be valid XML');
        }
      }
    } catch (error) {
      errors.push('Failed to fetch sitemap.xml');
    }

    // Validate HTTPS
    if (!this.baseUrl.startsWith('https://')) {
      errors.push('Site should use HTTPS for security and SEO benefits');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate performance SEO factors
   */
  async validatePerformance(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const startTime = Date.now();
      const response = await fetch(this.baseUrl);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Check response time
      if (responseTime > 3000) {
        errors.push(`Slow response time: ${responseTime}ms (should be < 3000ms)`);
      } else if (responseTime > 1000) {
        warnings.push(`Response time could be improved: ${responseTime}ms`);
      }

      const html = await response.text();

      // Check for performance optimizations
      if (!html.includes('next/image') && html.includes('<img')) {
        suggestions.push('Consider using next/image for automatic image optimization');
      }

      // Check for viewport meta tag
      if (!html.includes('name="viewport"')) {
        errors.push('Missing viewport meta tag for mobile optimization');
      }

      // Check for font optimization
      if (html.includes('font-display:') || html.includes('display=')) {
        // Good - font display optimization is present
      } else {
        suggestions.push('Consider adding font-display: swap for better loading performance');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate performance factors'],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Validate accessibility factors that affect SEO
   */
  async validateAccessibility(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();

      // Check heading structure
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      if (h1Count === 0) {
        errors.push('Missing H1 tag');
      } else if (h1Count > 1) {
        warnings.push(`Multiple H1 tags found (${h1Count}). Should have exactly one H1 per page`);
      }

      // Check image alt text
      const images = html.match(/<img[^>]+>/gi) || [];
      const imagesWithAlt = images.filter(img => img.includes('alt='));
      const altTextRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;

      if (altTextRatio < 1) {
        const missingCount = images.length - imagesWithAlt.length;
        warnings.push(`${missingCount} image(s) missing alt text`);
      }

      // Check for semantic HTML
      const hasMain = html.includes('<main');
      const hasHeader = html.includes('<header');
      const hasNav = html.includes('<nav');

      if (!hasMain) suggestions.push('Consider using <main> element for primary content');
      if (!hasHeader) suggestions.push('Consider using <header> element for page header');
      if (!hasNav) suggestions.push('Consider using <nav> element for navigation');

      // Check color contrast (basic check for dark text on light backgrounds)
      if (html.includes('color:') && !html.includes('contrast')) {
        suggestions.push('Ensure sufficient color contrast for accessibility and SEO');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate accessibility factors'],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Validate content SEO factors
   */
  async validateContent(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();

      // Extract text content (remove HTML tags)
      const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const wordCount = textContent.split(' ').length;

      // Check content length
      if (wordCount < 300) {
        warnings.push(`Content may be too short (${wordCount} words). Consider adding more descriptive content`);
      }

      // Check for target keywords
      const targetKeywords = ['offshore', 'rotation', 'calendar', 'schedule'];
      const missingKeywords = targetKeywords.filter(keyword => 
        !textContent.toLowerCase().includes(keyword)
      );

      if (missingKeywords.length > 0) {
        suggestions.push(`Consider including target keywords: ${missingKeywords.join(', ')}`);
      }

      // Check heading hierarchy
      const headings = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
      if (headings.length < 3) {
        suggestions.push('Consider adding more headings to improve content structure');
      }

      // Check for internal links
      const internalLinks = html.match(/<a[^>]+href=["\'][^"\']*["\'][^>]*>/gi) || [];
      const internalLinkCount = internalLinks.filter(link => 
        !link.includes('http') || link.includes(this.baseUrl)
      ).length;

      if (internalLinkCount < 2) {
        suggestions.push('Consider adding more internal links for better navigation and SEO');
      }

      return {
        isValid: warnings.length === 0 && errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate content factors'],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Validate individual schema object
   */
  private validateSchemaObject(schema: any): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required @context
    if (!schema['@context']) {
      errors.push('Missing @context in structured data');
    } else if (schema['@context'] !== 'https://schema.org') {
      warnings.push('@context should be "https://schema.org"');
    }

    // Check required @type
    if (!schema['@type']) {
      errors.push('Missing @type in structured data');
    }

    // Validate based on schema type
    if (schema['@type']) {
      const typeValidation = this.validateSchemaType(schema);
      errors.push(...typeValidation.errors);
      warnings.push(...typeValidation.warnings);
      suggestions.push(...typeValidation.suggestions);
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  /**
   * Validate specific schema types
   */
  private validateSchemaType(schema: any): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    switch (schema['@type']) {
      case 'Organization':
        if (!schema.name) errors.push('Organization schema missing name');
        if (!schema.url) errors.push('Organization schema missing url');
        if (!schema.logo) warnings.push('Organization schema missing logo');
        break;

      case 'SoftwareApplication':
        if (!schema.name) errors.push('SoftwareApplication schema missing name');
        if (!schema.description) warnings.push('SoftwareApplication schema missing description');
        if (!schema.applicationCategory) warnings.push('SoftwareApplication schema missing applicationCategory');
        break;

      case 'WebSite':
        if (!schema.name) errors.push('WebSite schema missing name');
        if (!schema.url) errors.push('WebSite schema missing url');
        if (!schema.potentialAction) suggestions.push('Consider adding search functionality to WebSite schema');
        break;

      case 'FAQPage':
        if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
          errors.push('FAQPage schema missing mainEntity array');
        }
        break;

      case 'HowTo':
        if (!schema.step || !Array.isArray(schema.step)) {
          errors.push('HowTo schema missing step array');
        }
        if (!schema.name) errors.push('HowTo schema missing name');
        break;

      default:
        suggestions.push(`Verify ${schema['@type']} schema follows Schema.org guidelines`);
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  /**
   * Calculate overall validation result
   */
  private calculateOverallResult(results: ComprehensiveValidationResult): SEOValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allSuggestions: string[] = [];

    // Collect all results
    Object.values(results).forEach(result => {
      if (result && typeof result === 'object' && 'errors' in result) {
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
        allSuggestions.push(...result.suggestions);
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions
    };
  }

  /**
   * Quick validation for essential SEO elements
   */
  async quickValidate(): Promise<SEOValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Quick checks for critical elements
      const response = await fetch(this.baseUrl);
      const html = await response.text();

      if (!html.includes('<title>')) errors.push('Missing title tag');
      if (!html.includes('name="description"')) errors.push('Missing meta description');
      if (!html.includes('name="viewport"')) errors.push('Missing viewport meta tag');
      
      // Check robots.txt
      try {
        await fetch(`${this.baseUrl}/robots.txt`);
      } catch {
        warnings.push('robots.txt not accessible');
      }

      // Check sitemap
      try {
        await fetch(`${this.baseUrl}/sitemap.xml`);
      } catch {
        warnings.push('sitemap.xml not accessible');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to perform quick validation'],
        warnings: [],
        suggestions: []
      };
    }
  }
}

// Type definitions
export interface ComprehensiveValidationResult {
  overall: SEOValidationResult;
  metadata: SEOValidationResult;
  structuredData: SEOValidationResult;
  technicalSEO: SEOValidationResult;
  performance: SEOValidationResult;
  accessibility: SEOValidationResult;
  content: SEOValidationResult;
}

/**
 * External validation integrations
 */
export class ExternalSEOValidator {
  /**
   * Validate with Google Rich Results Test (simulated)
   */
  static async validateWithGoogle(url: string): Promise<ExternalValidationResult> {
    // In a real implementation, this would call Google's Rich Results Test API
    // For now, return a simulated result
    return {
      service: 'Google Rich Results Test',
      isValid: true,
      richSnippetsFound: ['Organization', 'SoftwareApplication'],
      errors: [],
      warnings: [],
      url: `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`
    };
  }

  /**
   * Validate with Schema.org validator (simulated)
   */
  static async validateWithSchemaOrg(url: string): Promise<ExternalValidationResult> {
    return {
      service: 'Schema.org Validator',
      isValid: true,
      richSnippetsFound: [],
      errors: [],
      warnings: [],
      url: `https://validator.schema.org/?url=${encodeURIComponent(url)}`
    };
  }

  /**
   * Validate with Facebook Open Graph debugger (simulated)
   */
  static async validateWithFacebook(url: string): Promise<ExternalValidationResult> {
    return {
      service: 'Facebook Open Graph Debugger',
      isValid: true,
      richSnippetsFound: [],
      errors: [],
      warnings: [],
      url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`
    };
  }
}

export interface ExternalValidationResult {
  service: string;
  isValid: boolean;
  richSnippetsFound: string[];
  errors: string[];
  warnings: string[];
  url: string;
}

/**
 * Quick SEO validation
 */
export async function quickSEOValidation(url: string = 'https://offshore-mate.vercel.app'): Promise<SEOValidationResult> {
  const validator = new SEOValidator(url);
  return await validator.quickValidate();
}

/**
 * Comprehensive SEO validation
 */
export async function comprehensiveSEOValidation(url: string = 'https://offshore-mate.vercel.app'): Promise<ComprehensiveValidationResult> {
  const validator = new SEOValidator(url);
  return await validator.validateAll();
}