'use client';

import Script from 'next/script';
import { 
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateRotationFAQSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  generateScheduleProductSchema,
  combineSchemas,
  safeJSONLD
} from '@/lib/seo/structured-data';
import { RotationPattern } from '@/types/rotation';

// Base props for all structured data components
interface BaseStructuredDataProps {
  priority?: 'high' | 'normal' | 'low';
}

// Organization Schema Component
interface OrganizationSchemaProps extends BaseStructuredDataProps {}

export function OrganizationSchema({ priority = 'high' }: OrganizationSchemaProps) {
  const schema = generateOrganizationSchema();
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// Software Application Schema Component
interface SoftwareApplicationSchemaProps extends BaseStructuredDataProps {}

export function SoftwareApplicationSchema({ priority = 'high' }: SoftwareApplicationSchemaProps) {
  const schema = generateSoftwareApplicationSchema();
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id="software-application-schema"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// FAQ Schema Component
interface FAQSchemaProps extends BaseStructuredDataProps {
  rotationPattern?: RotationPattern;
}

export function FAQSchema({ rotationPattern, priority = 'normal' }: FAQSchemaProps) {
  const schema = rotationPattern 
    ? generateRotationFAQSchema(rotationPattern)
    : generateFAQSchema();
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id={`faq-schema${rotationPattern ? `-${rotationPattern}` : ''}`}
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// HowTo Schema Component
interface HowToSchemaProps extends BaseStructuredDataProps {}

export function HowToSchema({ priority = 'normal' }: HowToSchemaProps) {
  const schema = generateHowToSchema();
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id="how-to-schema"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// Breadcrumb Schema Component
interface BreadcrumbSchemaProps extends BaseStructuredDataProps {
  breadcrumbs: { name: string; url: string }[];
}

export function BreadcrumbSchema({ breadcrumbs, priority = 'low' }: BreadcrumbSchemaProps) {
  const schema = generateBreadcrumbSchema(breadcrumbs);
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// Website Schema Component
interface WebSiteSchemaProps extends BaseStructuredDataProps {}

export function WebSiteSchema({ priority = 'high' }: WebSiteSchemaProps) {
  const schema = generateWebSiteSchema();
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// Schedule Product Schema Component
interface ScheduleProductSchemaProps extends BaseStructuredDataProps {
  scheduleName: string;
  rotationPattern: RotationPattern;
  scheduleId: string;
}

export function ScheduleProductSchema({ 
  scheduleName, 
  rotationPattern, 
  scheduleId, 
  priority = 'normal' 
}: ScheduleProductSchemaProps) {
  const schema = generateScheduleProductSchema(scheduleName, rotationPattern, scheduleId);
  const jsonLD = safeJSONLD(schema);

  return (
    <Script
      id={`schedule-product-schema-${scheduleId}`}
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: jsonLD }}
    />
  );
}

// Combined Schema Component for multiple schemas
interface CombinedSchemaProps extends BaseStructuredDataProps {
  schemas: unknown[];
  id: string;
}

export function CombinedSchema({ schemas, id, priority = 'normal' }: CombinedSchemaProps) {
  const combinedJsonLD = combineSchemas(...schemas);

  return (
    <Script
      id={`combined-schema-${id}`}
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: combinedJsonLD }}
    />
  );
}

// Main Homepage Schema Bundle
interface HomepageSchemaProps extends BaseStructuredDataProps {}

export function HomepageSchema({ priority = 'high' }: HomepageSchemaProps) {
  const organizationSchema = generateOrganizationSchema();
  const softwareApplicationSchema = generateSoftwareApplicationSchema();
  const websiteSchema = generateWebSiteSchema();
  const faqSchema = generateFAQSchema();
  const howToSchema = generateHowToSchema();

  const combinedJsonLD = combineSchemas(
    organizationSchema,
    softwareApplicationSchema,
    websiteSchema,
    faqSchema,
    howToSchema
  );

  return (
    <Script
      id="homepage-schema-bundle"
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: combinedJsonLD }}
    />
  );
}

// Rotation Pattern Page Schema Bundle
interface RotationPatternSchemaProps extends BaseStructuredDataProps {
  rotationPattern: RotationPattern;
  breadcrumbs?: { name: string; url: string }[];
}

export function RotationPatternSchema({ 
  rotationPattern, 
  breadcrumbs = [],
  priority = 'high' 
}: RotationPatternSchemaProps) {
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateRotationFAQSchema(rotationPattern);
  const howToSchema = generateHowToSchema();
  
  const schemas: unknown[] = [organizationSchema, faqSchema, howToSchema];
  
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    schemas.push(breadcrumbSchema);
  }

  const combinedJsonLD = combineSchemas(...schemas);

  return (
    <Script
      id={`rotation-pattern-schema-${rotationPattern}`}
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: combinedJsonLD }}
    />
  );
}

// Shared Schedule Page Schema Bundle
interface SharedScheduleSchemaProps extends BaseStructuredDataProps {
  scheduleName: string;
  rotationPattern: RotationPattern;
  scheduleId: string;
  breadcrumbs?: { name: string; url: string }[];
}

export function SharedScheduleSchema({ 
  scheduleName,
  rotationPattern,
  scheduleId,
  breadcrumbs = [],
  priority = 'normal' 
}: SharedScheduleSchemaProps) {
  const organizationSchema = generateOrganizationSchema();
  const productSchema = generateScheduleProductSchema(scheduleName, rotationPattern, scheduleId);
  const faqSchema = generateRotationFAQSchema(rotationPattern);
  
  const schemas: unknown[] = [organizationSchema, productSchema, faqSchema];
  
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    schemas.push(breadcrumbSchema);
  }

  const combinedJsonLD = combineSchemas(...schemas);

  return (
    <Script
      id={`shared-schedule-schema-${scheduleId}`}
      type="application/ld+json"
      strategy={priority === 'high' ? 'beforeInteractive' : 'afterInteractive'}
      dangerouslySetInnerHTML={{ __html: combinedJsonLD }}
    />
  );
}