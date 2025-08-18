import { SEOConfig } from '@/types/seo';

// Base configuration for Offshore Mate
export const SEO_CONFIG: SEOConfig = {
  siteName: 'Offshore Mate',
  siteUrl: 'https://offshore-mate.vercel.app',
  defaultTitle: 'Offshore Mate - Work Rotation Calendar Generator',
  defaultDescription: 'Generate beautiful, professional offshore work rotation calendars. Create schedules for 14/14, 14/21, 21/21, and 28/28 patterns. Export to PNG, PDF, and iCal formats.',
  defaultImage: '/og-image.png',
  twitterHandle: '@offshore_mate',
  keywords: [
    'offshore calendar',
    'work rotation',
    'offshore schedule',
    '14/14 rotation',
    '21/21 rotation',
    '28/28 rotation',
    'offshore worker',
    'shift calendar',
    'rotation planner',
    'offshore planning',
    'work schedule generator',
    'calendar export',
    'shift planner'
  ],
  author: 'Ramūnas Nognys',
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Offshore Mate',
    url: 'https://offshore-mate.vercel.app',
    logo: 'https://offshore-mate.vercel.app/logo.png',
    description: 'Professional offshore work rotation calendar generator for oil & gas, maritime, and renewable energy workers.',
    foundingDate: '2024',
    sameAs: [
      'https://github.com/ramunasnognys/offshore-mate'
    ]
  }
};

// Page-specific SEO templates
export const SEO_TEMPLATES = {
  homepage: {
    title: 'Offshore Mate - Professional Work Rotation Calendar Generator',
    description: 'Create professional offshore work rotation calendars for any schedule pattern. Generate 14/14, 14/21, 21/21, and 28/28 rotations with beautiful exports to PNG, PDF, and iCal formats.',
    keywords: ['offshore calendar', 'rotation generator', 'work schedule', 'shift planner']
  },
  
  'rotation-14-14': {
    titleTemplate: '14/14 Rotation Calendar - %s | Offshore Mate',
    description: 'Generate 14 days on, 14 days off rotation calendars. Perfect for offshore oil & gas workers with standard 2-week rotations. Export to multiple formats.',
    keywords: ['14/14 rotation', '14 days on 14 days off', 'two week rotation', 'offshore schedule']
  },
  
  'rotation-14-21': {
    titleTemplate: '14/21 Rotation Calendar - %s | Offshore Mate',
    description: 'Create 14 days on, 21 days off rotation schedules. Ideal for workers with extended time off periods. Professional calendar generation and export.',
    keywords: ['14/21 rotation', '14 days on 21 days off', 'extended rotation', 'offshore calendar']
  },
  
  'rotation-21-21': {
    titleTemplate: '21/21 Rotation Calendar - %s | Offshore Mate', 
    description: 'Generate 21 days on, 21 days off rotation calendars. Perfect for long-term offshore assignments with equal work and rest periods.',
    keywords: ['21/21 rotation', '21 days on 21 days off', 'three week rotation', 'long rotation']
  },
  
  'rotation-28-28': {
    titleTemplate: '28/28 Rotation Calendar - %s | Offshore Mate',
    description: 'Create 28 days on, 28 days off rotation schedules. Ideal for extended offshore assignments with monthly rotation cycles.',
    keywords: ['28/28 rotation', '28 days on 28 days off', 'monthly rotation', 'extended offshore']
  },
  
  'shared-schedule': {
    titleTemplate: 'Shared %s Schedule - %s | Offshore Mate',
    description: 'View and import this shared offshore work rotation schedule. Professional calendar with export options for your planning needs.',
    keywords: ['shared schedule', 'offshore calendar', 'rotation import', 'schedule sharing']
  }
} as const;

// Core Web Vitals thresholds (2024 standards)
export const CORE_WEB_VITALS = {
  LCP: {
    good: 2.5, // seconds
    needsImprovement: 4.0
  },
  INP: {
    good: 200, // milliseconds  
    needsImprovement: 500
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25
  }
} as const;

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  quality: 85,
  formats: ['webp', 'avif'],
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 80vw', 
    desktop: '60vw'
  },
  ogImageSize: {
    width: 1200,
    height: 630
  }
} as const;

// Structured data constants
export const SCHEMA_CONSTANTS = {
  softwareApplication: {
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  },
  
  faqItems: [
    {
      question: 'What rotation patterns does Offshore Mate support?',
      answer: 'Offshore Mate supports all common offshore rotation patterns including 14/14 (14 days on, 14 days off), 14/21, 21/21, and 28/28 rotations. You can also create custom rotation patterns.'
    },
    {
      question: 'Can I export my rotation calendar?',
      answer: 'Yes! You can export your offshore rotation calendar in multiple formats: high-quality PNG images, professional PDF documents, and iCal files that can be imported into Google Calendar, Outlook, and other calendar applications.'
    },
    {
      question: 'How do I share my rotation schedule with colleagues?',
      answer: 'You can save your rotation schedule and generate a shareable link that allows colleagues to view and import your calendar. The shared schedule includes all rotation details and export options.'
    },
    {
      question: 'Is Offshore Mate free to use?',
      answer: 'Yes, Offshore Mate is completely free to use. You can generate unlimited rotation calendars, save multiple schedules, and export in all available formats without any cost.'
    }
  ],
  
  howToSteps: [
    {
      name: 'Select Start Date',
      text: 'Choose your rotation start date using the calendar picker. Select any future date when your rotation cycle begins.',
      url: '#date-selection'
    },
    {
      name: 'Choose Rotation Pattern',
      text: 'Select your offshore rotation pattern from the available options: 14/14, 14/21, 21/21, or 28/28. Each pattern shows the work days and off days clearly.',
      url: '#rotation-selection'
    },
    {
      name: 'Generate Calendar',
      text: 'Click "Generate Calendar" to create your personalized offshore rotation schedule. The calendar will show your full year with color-coded work and off days.',
      url: '#calendar-generation'
    },
    {
      name: 'Save and Export',
      text: 'Save your schedule for future access and export in your preferred format: PNG for sharing, PDF for printing, or iCal for calendar apps.',
      url: '#export-options'
    }
  ]
} as const;

// Robots.txt configuration
export const ROBOTS_CONFIG = {
  userAgent: '*',
  allow: ['/'],
  disallow: ['/api/'],
  sitemap: 'https://offshore-mate.vercel.app/sitemap.xml'
} as const;

// Sitemap configuration
export const SITEMAP_CONFIG = {
  changeFrequency: 'daily' as const,
  priority: {
    homepage: 1.0,
    rotationPages: 0.8,
    staticPages: 0.6,
    sharedSchedules: 0.4
  }
} as const;

// Social media and sharing
export const SOCIAL_CONFIG = {
  openGraph: {
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: SEO_CONFIG.twitterHandle
  }
} as const;

// Performance optimization constants
export const PERFORMANCE_CONFIG = {
  criticalResourceHints: ['preload', 'prefetch'],
  fontDisplay: 'swap',
  lazyLoadingOffset: '200px',
  imagePriority: {
    aboveFold: true,
    belowFold: false
  }
} as const;