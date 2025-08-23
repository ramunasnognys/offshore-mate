// Enhanced card system types and interfaces for Offshore Mate

export type RotationType = '14/21' | '28/28' | '14/14' | '15/20' | 'Custom';

export type CardVariant = 
  | 'rotation-selection' 
  | 'date-picker' 
  | 'day-display' 
  | 'info-panel'
  | 'action-card'
  | 'navigation-card';

export type DeviceContext = 'mobile' | 'desktop' | 'tablet';

export type InteractionMode = 'touch' | 'mouse' | 'keyboard' | 'voice';

export type ImportanceLevel = 'primary' | 'secondary' | 'tertiary';

export type CognitiveBias = 'selection' | 'confirmation' | 'attention' | 'none';

export type AnimationState = 
  | 'idle' 
  | 'hover' 
  | 'focus' 
  | 'active' 
  | 'loading' 
  | 'selection-enhanced'
  | 'disabled'
  | 'error';

export type DayType = 'work' | 'off' | 'transition' | 'non-rotation';

// Card state interface
export interface CardState {
  isHovered: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  hasError: boolean;
  animationState: AnimationState;
  interactionCount: number;
  lastInteraction: Date | null;
}

// User preferences interface
export interface UserPreferences {
  cognitiveBias: CognitiveBias;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  vibrancyLevel: number; // 0.5 to 2.0
  animationIntensity: number; // 0.0 to 1.0
  touchSensitivity: number; // 0.5 to 2.0
}

// System capabilities interface
export interface SystemCapabilities {
  supportsAdvancedAnimations: boolean;
  supportsBackdropFilter: boolean;
  supportsContainerQueries: boolean;
  supportsHoverStates: boolean;
  devicePixelRatio: number;
  maxTouchPoints: number;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

// Base card props interface
export interface BaseCardProps {
  variant: CardVariant;
  context: DeviceContext;
  interactionMode: InteractionMode;
  importance: ImportanceLevel;
  rotationType?: RotationType;
  dayType?: DayType;
  
  // Feature flags
  adaptiveContrast?: boolean;
  physicsEnabled?: boolean;
  magneticHover?: boolean;
  glassEffect?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
  ariaSelected?: boolean;
  ariaExpanded?: boolean;
  
  // Cognitive bias optimization
  cognitiveBias?: CognitiveBias;
  
  // Animation preferences
  animationDuration?: number;
  animationEasing?: string;
  
  // Custom styling
  className?: string;
  style?: React.CSSProperties;
  
  // Interaction handlers
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (isHovered: boolean) => void;
  onFocus?: (isFocused: boolean) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  
  // Children and content
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  badge?: string | number;
}

// Enhanced card props extending base props
export interface SmartCardProps extends BaseCardProps {
  // State management
  initialState?: Partial<CardState>;
  onStateChange?: (state: CardState) => void;
  
  // Performance optimization
  _lazyLoad?: boolean;
  _preloadOnHover?: boolean;
  _deferNonCriticalStyles?: boolean;
  
  // Advanced interaction
  magneticRange?: number; // pixels
  hoverDelay?: number; // milliseconds
  focusDelay?: number; // milliseconds
  
  // Contextual adaptation
  environmentalData?: {
    ambientLight?: 'bright' | 'normal' | 'dim';
    userActivity?: 'active' | 'idle' | 'focused';
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

// Rotation card specific props
export interface RotationCardProps extends SmartCardProps {
  rotationType: RotationType;
  workDays: number;
  offDays: number;
  isSelected: boolean;
  onSelect: (rotation: RotationType) => void;
  description: string;
  popularity?: number; // 0-1 scale for visual emphasis
  recommendationScore?: number; // 0-1 scale for AI-driven recommendations
}

// Date picker card specific props
export interface DateCardProps extends SmartCardProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: string;
  timeZone?: string;
}

// Calendar day card specific props
export interface DayCardProps extends SmartCardProps {
  date: Date;
  dayType: DayType;
  isToday?: boolean;
  isWeekend?: boolean;
  isHoliday?: boolean;
  events?: Array<{
    id: string;
    title: string;
    type: 'work' | 'personal' | 'travel';
  }>;
  onDateClick?: (date: Date) => void;
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// Card theme configuration
export interface CardTheme {
  rotation: RotationType;
  colors: {
    primary: string;
    primaryRgb: string;
    background: string;
    backgroundHover: string;
    border: string;
    borderHover: string;
    text: string;
  };
  animations: {
    hover: AnimationConfig;
    focus: AnimationConfig;
    selection: AnimationConfig;
  };
}

// Card metrics for analytics and optimization
export interface CardMetrics {
  renderTime: number;
  interactionLatency: number;
  animationFrameRate: number;
  memoryUsage: number;
  errorCount: number;
  userSatisfactionScore?: number;
}

// Hook return types
export interface UseCardStateReturn {
  state: CardState;
  transitionState: (newState: Partial<CardState>) => void;
  resetState: () => void;
  metrics: CardMetrics;
}

export interface UseCardAnimationReturn {
  isAnimating: boolean;
  startAnimation: (type: keyof AnimationConfig) => void;
  stopAnimation: () => void;
  setAnimationConfig: (config: Partial<AnimationConfig>) => void;
}

export interface UseCardAccessibilityReturn {
  ariaProps: Record<string, string | boolean | undefined>;
  keyboardHandlers: Record<string, (event: React.KeyboardEvent) => void>;
  focusHelpers: {
    focusCard: () => void;
    blurCard: () => void;
    announceToScreenReader: (message: string) => void;
  };
}

// Utility types for card system
export type CardStyleVariables = Record<string, string | number>;
export type CardEventHandlers = Record<string, ((...args: unknown[]) => void)>;
export type CardClassNames = Record<string, string>;

// Card collection and management
export interface CardCollection {
  cards: Array<{
    id: string;
    props: SmartCardProps;
    metadata: {
      createdAt: Date;
      lastModified: Date;
      version: string;
    };
  }>;
  layout: 'grid' | 'list' | 'masonry' | 'carousel';
  responsiveBreakpoints: Record<DeviceContext, number>;
}

// Export default interfaces for common usage
export type {
  BaseCardProps as CardProps,
  SmartCardProps as EnhancedCardProps,
};