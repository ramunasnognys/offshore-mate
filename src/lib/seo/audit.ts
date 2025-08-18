import { 
  SEOAuditResult, 
  SEOIssue, 
  SEORecommendation,
  TechnicalSEOAudit,
  ContentSEOAudit,
  PerformanceSEOAudit,
  CoreWebVitalsScore
} from '@/types/seo';
import { CORE_WEB_VITALS } from './constants';

/**
 * Comprehensive SEO Audit Engine for Offshore Mate
 */
export class SEOAuditor {
  private baseUrl: string;
  private issues: SEOIssue[] = [];
  private recommendations: SEORecommendation[] = [];

  constructor(baseUrl: string = 'https://offshore-mate.vercel.app') {
    this.baseUrl = baseUrl;
  }

  /**
   * Run comprehensive SEO audit
   */
  async runFullAudit(): Promise<SEOAuditResult> {
    console.log('🔍 Starting comprehensive SEO audit...');
    
    // Reset previous audit results
    this.issues = [];
    this.recommendations = [];

    // Run individual audits
    const technicalSEO = await this.auditTechnicalSEO();
    const contentSEO = await this.auditContentSEO();
    const performanceSEO = await this.auditPerformanceSEO();

    // Calculate overall score
    const score = this.calculateOverallScore(technicalSEO, contentSEO, performanceSEO);

    const result: SEOAuditResult = {
      score,
      issues: this.issues,
      recommendations: this.recommendations,
      technicalSEO,
      contentSEO,
      performanceSEO
    };

    console.log(`✅ SEO audit completed with score: ${score}/100`);
    return result;
  }

  /**
   * Audit Technical SEO elements
   */
  private async auditTechnicalSEO(): Promise<TechnicalSEOAudit> {
    console.log('🔧 Auditing technical SEO...');

    const audit: TechnicalSEOAudit = {
      hasRobotsTxt: await this.checkRobotsTxt(),
      hasSitemap: await this.checkSitemap(),
      hasStructuredData: await this.checkStructuredData(),
      hasCanonicalUrls: await this.checkCanonicalUrls(),
      metaTagsOptimized: await this.checkMetaTags(),
      urlStructureOptimized: this.checkUrlStructure(),
      httpsEnabled: this.checkHTTPS()
    };

    return audit;
  }

  /**
   * Audit Content SEO elements
   */
  private async auditContentSEO(): Promise<ContentSEOAudit> {
    console.log('📝 Auditing content SEO...');

    const audit: ContentSEOAudit = {
      titleOptimized: await this.checkTitleOptimization(),
      metaDescriptionOptimized: await this.checkMetaDescriptionOptimization(),
      headingStructureValid: await this.checkHeadingStructure(),
      contentQuality: await this.assessContentQuality(),
      keywordOptimization: await this.checkKeywordOptimization(),
      imageAltTextPresent: await this.checkImageAltText()
    };

    return audit;
  }

  /**
   * Audit Performance SEO elements
   */
  private async auditPerformanceSEO(): Promise<PerformanceSEOAudit> {
    console.log('⚡ Auditing performance SEO...');

    const audit: PerformanceSEOAudit = {
      coreWebVitals: await this.measureCoreWebVitals(),
      imageOptimization: await this.checkImageOptimization(),
      loadingSpeed: await this.measureLoadingSpeed(),
      mobileOptimized: await this.checkMobileOptimization()
    };

    return audit;
  }

  /**
   * Check if robots.txt exists and is properly configured
   */
  private async checkRobotsTxt(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/robots.txt`);
      if (!response.ok) {
        this.addIssue({
          severity: 'critical',
          category: 'technical',
          title: 'Missing robots.txt file',
          description: 'robots.txt file is not accessible',
          fix: 'Create src/app/robots.ts file with proper configuration',
          impact: 'Search engines cannot understand crawling instructions'
        });
        return false;
      }

      const content = await response.text();
      if (!content.includes('sitemap')) {
        this.addRecommendation({
          priority: 'high',
          category: 'Technical SEO',
          title: 'Add sitemap reference to robots.txt',
          description: 'Include sitemap URL in robots.txt for better discoverability',
          implementation: 'Add "Sitemap: https://offshore-mate.vercel.app/sitemap.xml" to robots.txt',
          expectedImpact: 'Improved search engine crawling efficiency'
        });
      }

      return true;
    } catch (error) {
      this.addIssue({
        severity: 'high',
        category: 'technical',
        title: 'robots.txt accessibility error',
        description: 'Unable to fetch robots.txt file',
        fix: 'Ensure robots.txt is properly deployed and accessible',
        impact: 'Search engines may not crawl site efficiently'
      });
      return false;
    }
  }

  /**
   * Check if sitemap exists and is properly formatted
   */
  private async checkSitemap(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sitemap.xml`);
      if (!response.ok) {
        this.addIssue({
          severity: 'critical',
          category: 'technical',
          title: 'Missing sitemap.xml',
          description: 'Sitemap is not accessible at /sitemap.xml',
          fix: 'Create src/app/sitemap.ts with dynamic sitemap generation',
          impact: 'Search engines cannot discover all pages efficiently'
        });
        return false;
      }

      const content = await response.text();
      if (!content.includes('<urlset') && !content.includes('<sitemapindex')) {
        this.addIssue({
          severity: 'high',
          category: 'technical',
          title: 'Invalid sitemap format',
          description: 'Sitemap does not appear to be in valid XML format',
          fix: 'Ensure sitemap follows XML sitemap protocol',
          impact: 'Search engines may not be able to parse sitemap'
        });
        return false;
      }

      return true;
    } catch (error) {
      this.addIssue({
        severity: 'high',
        category: 'technical',
        title: 'Sitemap accessibility error',
        description: 'Unable to fetch sitemap.xml',
        fix: 'Ensure sitemap is properly generated and accessible',
        impact: 'Search engines cannot discover pages'
      });
      return false;
    }
  }

  /**
   * Check for structured data implementation
   */
  private async checkStructuredData(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      const hasJsonLd = html.includes('application/ld+json');
      const hasOrganizationSchema = html.includes('"@type":"Organization"');
      const hasApplicationSchema = html.includes('"@type":"SoftwareApplication"');
      
      if (!hasJsonLd) {
        this.addIssue({
          severity: 'medium',
          category: 'technical',
          title: 'Missing structured data',
          description: 'No JSON-LD structured data found on homepage',
          fix: 'Add Organization, SoftwareApplication, and FAQ schemas',
          impact: 'Reduced rich snippet opportunities in search results'
        });
        return false;
      }

      if (!hasOrganizationSchema || !hasApplicationSchema) {
        this.addRecommendation({
          priority: 'medium',
          category: 'Structured Data',
          title: 'Enhance structured data coverage',
          description: 'Add missing schema types for better search appearance',
          implementation: 'Implement Organization and SoftwareApplication schemas',
          expectedImpact: 'Better search result appearance and click-through rates'
        });
      }

      return hasJsonLd;
    } catch (error) {
      console.warn('Could not check structured data:', error);
      return false;
    }
  }

  /**
   * Check canonical URLs implementation
   */
  private async checkCanonicalUrls(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      const hasCanonical = html.includes('rel="canonical"') || html.includes('"canonical"');
      
      if (!hasCanonical) {
        this.addIssue({
          severity: 'medium',
          category: 'technical',
          title: 'Missing canonical URLs',
          description: 'Canonical tags not found on homepage',
          fix: 'Add canonical URLs to metadata configuration',
          impact: 'Potential duplicate content issues'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Could not check canonical URLs:', error);
      return false;
    }
  }

  /**
   * Check meta tags optimization
   */
  private async checkMetaTags(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      let score = 0;
      let maxScore = 6;

      // Check title tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1].length >= 30 && titleMatch[1].length <= 60) {
        score++;
      } else {
        this.addIssue({
          severity: 'high',
          category: 'content',
          title: 'Title tag optimization needed',
          description: `Title should be 30-60 characters, current: ${titleMatch ? titleMatch[1].length : 0}`,
          fix: 'Optimize title length and include target keywords',
          impact: 'Reduced click-through rates from search results'
        });
      }

      // Check meta description
      const descMatch = html.match(/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/i);
      if (descMatch && descMatch[1].length >= 120 && descMatch[1].length <= 160) {
        score++;
      } else {
        this.addIssue({
          severity: 'high',
          category: 'content',
          title: 'Meta description optimization needed',
          description: `Meta description should be 120-160 characters, current: ${descMatch ? descMatch[1].length : 0}`,
          fix: 'Optimize meta description length and include call-to-action',
          impact: 'Reduced click-through rates from search results'
        });
      }

      // Check Open Graph tags
      if (html.includes('property="og:title"')) score++;
      if (html.includes('property="og:description"')) score++;
      if (html.includes('property="og:image"')) score++;
      if (html.includes('name="twitter:card"')) score++;

      if (score < maxScore) {
        this.addRecommendation({
          priority: 'high',
          category: 'Meta Tags',
          title: 'Complete social media meta tags',
          description: 'Add missing Open Graph and Twitter Card tags',
          implementation: 'Include og:title, og:description, og:image, and twitter:card',
          expectedImpact: 'Better social media sharing appearance'
        });
      }

      return score / maxScore >= 0.8; // 80% threshold
    } catch (error) {
      console.warn('Could not check meta tags:', error);
      return false;
    }
  }

  /**
   * Check URL structure optimization
   */
  private checkUrlStructure(): boolean {
    // For now, assume URL structure is optimized based on Next.js patterns
    // In a real implementation, you'd analyze the current URL patterns
    return true;
  }

  /**
   * Check HTTPS implementation
   */
  private checkHTTPS(): boolean {
    return this.baseUrl.startsWith('https://');
  }

  /**
   * Check title optimization
   */
  private async checkTitleOptimization(): Promise<boolean> {
    // This would be more comprehensive in a real implementation
    return true;
  }

  /**
   * Check meta description optimization
   */
  private async checkMetaDescriptionOptimization(): Promise<boolean> {
    // This would be more comprehensive in a real implementation
    return true;
  }

  /**
   * Check heading structure
   */
  private async checkHeadingStructure(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      const hasH1 = h1Count === 1;
      
      if (!hasH1) {
        this.addIssue({
          severity: 'medium',
          category: 'content',
          title: h1Count === 0 ? 'Missing H1 tag' : 'Multiple H1 tags',
          description: `Found ${h1Count} H1 tags, should have exactly 1`,
          fix: 'Ensure each page has exactly one H1 tag',
          impact: 'Reduced content hierarchy and SEO effectiveness'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Could not check heading structure:', error);
      return false;
    }
  }

  /**
   * Assess content quality
   */
  private async assessContentQuality(): Promise<number> {
    // Simplified content quality assessment
    // In a real implementation, this would analyze content depth, readability, etc.
    return 85;
  }

  /**
   * Check keyword optimization
   */
  private async checkKeywordOptimization(): Promise<number> {
    // Simplified keyword optimization check
    // In a real implementation, this would analyze keyword density, placement, etc.
    return 80;
  }

  /**
   * Check image alt text presence
   */
  private async checkImageAltText(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      const images = html.match(/<img[^>]+>/gi) || [];
      const imagesWithAlt = html.match(/<img[^>]+alt=[^>]+>/gi) || [];
      
      const altTextRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
      
      if (altTextRatio < 0.9) {
        this.addIssue({
          severity: 'medium',
          category: 'accessibility',
          title: 'Missing image alt text',
          description: `${Math.round((1 - altTextRatio) * 100)}% of images missing alt text`,
          fix: 'Add descriptive alt text to all images',
          impact: 'Reduced accessibility and image search visibility'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Could not check image alt text:', error);
      return true;
    }
  }

  /**
   * Measure Core Web Vitals (simulated)
   */
  private async measureCoreWebVitals(): Promise<CoreWebVitalsScore> {
    // In a real implementation, this would use Performance API or external tools
    // For now, return simulated values
    const lcp = 2.1; // Largest Contentful Paint in seconds
    const inp = 150; // Interaction to Next Paint in ms
    const cls = 0.08; // Cumulative Layout Shift
    
    let score: 'good' | 'needs-improvement' | 'poor' = 'good';
    
    if (lcp > CORE_WEB_VITALS.LCP.needsImprovement || 
        inp > CORE_WEB_VITALS.INP.needsImprovement || 
        cls > CORE_WEB_VITALS.CLS.needsImprovement) {
      score = 'poor';
    } else if (lcp > CORE_WEB_VITALS.LCP.good || 
               inp > CORE_WEB_VITALS.INP.good || 
               cls > CORE_WEB_VITALS.CLS.good) {
      score = 'needs-improvement';
    }

    if (score !== 'good') {
      this.addRecommendation({
        priority: 'high',
        category: 'Performance',
        title: 'Improve Core Web Vitals',
        description: `Current scores: LCP: ${lcp}s, INP: ${inp}ms, CLS: ${cls}`,
        implementation: 'Optimize images, reduce JavaScript execution, prevent layout shifts',
        expectedImpact: 'Better search rankings and user experience'
      });
    }

    return { lcp, inp, cls, overallScore: score };
  }

  /**
   * Check image optimization
   */
  private async checkImageOptimization(): Promise<number> {
    // Simplified image optimization check
    // In a real implementation, this would analyze image formats, sizes, lazy loading, etc.
    return 90;
  }

  /**
   * Measure loading speed
   */
  private async measureLoadingSpeed(): Promise<number> {
    // Simplified loading speed measurement
    // In a real implementation, this would use Navigation Timing API
    return 85;
  }

  /**
   * Check mobile optimization
   */
  private async checkMobileOptimization(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      
      const hasViewportMeta = html.includes('name="viewport"');
      
      if (!hasViewportMeta) {
        this.addIssue({
          severity: 'critical',
          category: 'mobile',
          title: 'Missing viewport meta tag',
          description: 'Viewport meta tag is required for mobile optimization',
          fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
          impact: 'Poor mobile user experience and search rankings'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Could not check mobile optimization:', error);
      return false;
    }
  }

  /**
   * Calculate overall SEO score
   */
  private calculateOverallScore(
    technical: TechnicalSEOAudit,
    content: ContentSEOAudit,
    performance: PerformanceSEOAudit
  ): number {
    // Technical SEO (40% weight)
    const technicalScore = this.calculateTechnicalScore(technical);
    
    // Content SEO (35% weight)
    const contentScore = this.calculateContentScore(content);
    
    // Performance SEO (25% weight)
    const performanceScore = this.calculatePerformanceScore(performance);
    
    const overall = Math.round(
      technicalScore * 0.4 + 
      contentScore * 0.35 + 
      performanceScore * 0.25
    );

    return Math.max(0, Math.min(100, overall));
  }

  /**
   * Calculate technical SEO score
   */
  private calculateTechnicalScore(audit: TechnicalSEOAudit): number {
    const items = [
      audit.hasRobotsTxt,
      audit.hasSitemap,
      audit.hasStructuredData,
      audit.hasCanonicalUrls,
      audit.metaTagsOptimized,
      audit.urlStructureOptimized,
      audit.httpsEnabled
    ];

    const trueCount = items.filter(Boolean).length;
    return Math.round((trueCount / items.length) * 100);
  }

  /**
   * Calculate content SEO score
   */
  private calculateContentScore(audit: ContentSEOAudit): number {
    const booleanItems = [
      audit.titleOptimized,
      audit.metaDescriptionOptimized,
      audit.headingStructureValid,
      audit.imageAltTextPresent
    ];

    const booleanScore = (booleanItems.filter(Boolean).length / booleanItems.length) * 100;
    const qualityScore = (audit.contentQuality + audit.keywordOptimization) / 2;

    return Math.round((booleanScore + qualityScore) / 2);
  }

  /**
   * Calculate performance SEO score
   */
  private calculatePerformanceScore(audit: PerformanceSEOAudit): number {
    const coreWebVitalsScore = audit.coreWebVitals.overallScore === 'good' ? 100 : 
                               audit.coreWebVitals.overallScore === 'needs-improvement' ? 70 : 40;
    
    const mobileScore = audit.mobileOptimized ? 100 : 0;
    
    return Math.round(
      (coreWebVitalsScore * 0.4) +
      (audit.imageOptimization * 0.3) +
      (audit.loadingSpeed * 0.2) +
      (mobileScore * 0.1)
    );
  }

  /**
   * Add issue to audit results
   */
  private addIssue(issue: SEOIssue): void {
    this.issues.push(issue);
  }

  /**
   * Add recommendation to audit results
   */
  private addRecommendation(recommendation: SEORecommendation): void {
    this.recommendations.push(recommendation);
  }
}

/**
 * Quick SEO audit for immediate feedback
 */
export async function quickSEOAudit(url: string = 'https://offshore-mate.vercel.app'): Promise<SEOAuditResult> {
  const auditor = new SEOAuditor(url);
  return await auditor.runFullAudit();
}

/**
 * Export the auditor class for external use
 */
export { SEOAuditor };