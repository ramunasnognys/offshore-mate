/**
 * Comprehensive SEO Library for Offshore Mate
 * 
 * This library provides a complete SEO optimization system including:
 * - Dynamic metadata generation
 * - Structured data (JSON-LD) schemas
 * - SEO audit and optimization
 * - Validation and testing
 * - Performance monitoring
 */

// Metadata and constants
export * from './metadata';
export * from './constants';

// Structured data
export * from './structured-data';

// SEO audit engine
export { SEOAuditor, quickSEOAudit } from './audit';

// SEO optimizer
export { 
  SEOOptimizer, 
  quickOptimize,
  type OptimizationResult,
  type AppliedOptimization,
  type OptimizedMetadata,
  type ContentSuggestions,
  type ImageOptimizationResult
} from './optimizer';

// SEO validator
export { 
  SEOValidator,
  ExternalSEOValidator,
  quickSEOValidation,
  comprehensiveSEOValidation,
  type ComprehensiveValidationResult,
  type ExternalValidationResult
} from './validator';

// SEO types
export * from '@/types/seo';

/**
 * Main SEO Manager class that orchestrates all SEO functionality
 */
export class SEOManager {
  private auditor: SEOAuditor;
  private optimizer: SEOOptimizer;
  private validator: SEOValidator;
  private baseUrl: string;

  constructor(baseUrl: string = 'https://offshore-mate.vercel.app', optimizationLevel: 'basic' | 'standard' | 'advanced' | 'enterprise' = 'standard') {
    this.baseUrl = baseUrl;
    this.auditor = new SEOAuditor(baseUrl);
    this.optimizer = new SEOOptimizer(optimizationLevel);
    this.validator = new SEOValidator(baseUrl);
  }

  /**
   * Complete SEO workflow: Audit -> Optimize -> Validate
   */
  async runCompleteSEOWorkflow() {
    console.log('🚀 Starting complete SEO workflow...');
    
    // Step 1: Audit current SEO state
    const auditResult = await this.auditor.runFullAudit();
    
    // Step 2: Apply optimizations based on audit
    const optimizationResult = await this.optimizer.optimizeFromAudit(auditResult);
    
    // Step 3: Validate the optimized implementation
    const validationResult = await this.validator.validateAll();
    
    // Step 4: Generate comprehensive report
    const report = {
      audit: auditResult,
      optimizations: optimizationResult,
      validation: validationResult,
      summary: {
        initialScore: auditResult.score,
        optimizationsApplied: optimizationResult.optimizationsApplied,
        finalValidation: validationResult.overall.isValid,
        recommendations: this.generateFinalRecommendations(auditResult, optimizationResult, validationResult)
      }
    };

    console.log('✅ Complete SEO workflow finished');
    return report;
  }

  /**
   * Quick SEO health check
   */
  async quickHealthCheck() {
    console.log('⚡ Running quick SEO health check...');
    
    const [auditResult, validationResult] = await Promise.all([
      this.auditor.runFullAudit(),
      this.validator.quickValidate()
    ]);

    return {
      score: auditResult.score,
      criticalIssues: auditResult.issues.filter(issue => issue.severity === 'critical').length,
      validationErrors: validationResult.errors.length,
      isHealthy: auditResult.score > 80 && validationResult.errors.length === 0,
      quickFixes: auditResult.issues
        .filter(issue => issue.severity === 'high')
        .slice(0, 3)
        .map(issue => issue.fix)
    };
  }

  /**
   * Generate final recommendations
   */
  private generateFinalRecommendations(auditResult: any, optimizationResult: any, validationResult: any): string[] {
    const recommendations = [];

    // Based on remaining validation errors
    if (validationResult.overall.errors.length > 0) {
      recommendations.push(`Address ${validationResult.overall.errors.length} remaining validation errors`);
    }

    // Based on audit score
    if (auditResult.score < 90) {
      recommendations.push('Continue improving SEO score - aim for 90+ points');
    }

    // Based on optimization success
    if (optimizationResult.errors.length > 0) {
      recommendations.push('Review failed optimizations and implement manual fixes');
    }

    // Performance recommendations
    if (auditResult.performanceSEO.coreWebVitals.overallScore !== 'good') {
      recommendations.push('Focus on Core Web Vitals improvements for better rankings');
    }

    // Content recommendations
    if (auditResult.contentSEO.contentQuality < 85) {
      recommendations.push('Enhance content quality and keyword optimization');
    }

    return recommendations;
  }
}

/**
 * Utility functions for common SEO operations
 */
export const SEOUtils = {
  /**
   * Generate SEO-friendly slug from text
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  /**
   * Extract keywords from text
   */
  extractKeywords: (text: string, count: number = 10): string[] => {
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'have', 'their', 'said', 'each', 'which', 'them', 'more', 'very', 'what', 'know', 'just', 'time', 'work', 'good', 'some', 'could', 'other'].includes(word));

    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([word]) => word);
  },

  /**
   * Calculate reading time for content
   */
  calculateReadingTime: (text: string, wordsPerMinute: number = 200): number => {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },

  /**
   * Optimize text length for SEO
   */
  optimizeTextLength: (text: string, minLength: number, maxLength: number, suffix: string = '...'): string => {
    if (text.length < minLength) {
      return text; // Return as-is if too short
    }
    
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Generate meta description from content
   */
  generateMetaDescription: (content: string): string => {
    // Remove HTML tags and extra whitespace
    const cleanContent = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract first meaningful sentence or 150 characters
    const firstSentence = cleanContent.split('.')[0];
    if (firstSentence.length >= 120 && firstSentence.length <= 160) {
      return firstSentence + '.';
    }

    return SEOUtils.optimizeTextLength(cleanContent, 120, 157, '...');
  }
};

/**
 * Quick setup function for immediate SEO improvements
 */
export async function setupSEOOptimization(baseUrl?: string) {
  const manager = new SEOManager(baseUrl);
  const healthCheck = await manager.quickHealthCheck();
  
  console.log(`
🔍 SEO Health Check Results:
- Score: ${healthCheck.score}/100
- Critical Issues: ${healthCheck.criticalIssues}
- Validation Errors: ${healthCheck.validationErrors}
- Status: ${healthCheck.isHealthy ? '✅ HEALTHY' : '⚠️  NEEDS ATTENTION'}

Quick Fixes:
${healthCheck.quickFixes.map(fix => `- ${fix}`).join('\n')}
  `);

  return {
    manager,
    healthCheck,
    runFullOptimization: () => manager.runCompleteSEOWorkflow()
  };
}