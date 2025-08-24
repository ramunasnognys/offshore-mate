import React, { useMemo, useCallback, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { SmartCardProps, CardState, RotationType, DayType } from '@/types/card-system';

// Hook for card state management
export const useCardState = (cardId: string, initialState?: Partial<CardState>) => {
  const [state, setState] = React.useState<CardState>({
    isHovered: false,
    isFocused: false,
    isSelected: false,
    isLoading: false,
    isDisabled: false,
    hasError: false,
    animationState: 'idle',
    interactionCount: 0,
    lastInteraction: null,
    ...initialState,
  });

  const transitionState = useCallback((newState: Partial<CardState>) => {
    setState(current => {
      const nextState = { ...current, ...newState };
      
      // Track interactions
      if (newState.isHovered !== undefined || newState.isFocused !== undefined) {
        nextState.interactionCount = current.interactionCount + 1;
        nextState.lastInteraction = new Date();
      }
      
      // Update animation state based on interactions
      if (nextState.isSelected && !current.isSelected) {
        // nextState.animationState = 'selection-enhanced';
        nextState.animationState = 'idle';
      } else if (nextState.isHovered && !current.isHovered) {
        nextState.animationState = 'hover';
      } else if (nextState.isFocused && !current.isFocused) {
        nextState.animationState = 'focus';
      } else if (!nextState.isHovered && !nextState.isFocused && !nextState.isSelected) {
        nextState.animationState = 'idle';
      }
      
      return nextState;
    });
  }, []);

  const resetState = useCallback(() => {
    setState({
      isHovered: false,
      isFocused: false,
      isSelected: false,
      isLoading: false,
      isDisabled: false,
      hasError: false,
      animationState: 'idle',
      interactionCount: 0,
      lastInteraction: null,
    });
  }, []);

  return { state, transitionState, resetState };
};

// Main SmartCard component
export const SmartCard = forwardRef<HTMLDivElement, SmartCardProps>(({
  variant,
  context,
  interactionMode,
  importance,
  rotationType,
  dayType,
  adaptiveContrast = true,
  physicsEnabled = false,
  magneticHover = false,
  glassEffect = true,
  // Phase 2 enhancements
  phase2Enhanced = false,
  microInteractions = false,
  enhancedShadows = false,
  gradientBackground = false,
  borderEffects = false,
  enhancedTypography = false,
  visualIndicators = false,
  ariaLabel,
  ariaDescription,
  ariaSelected,
  ariaExpanded,
  cognitiveBias,
  animationDuration = 300,
  animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  className,
  style,
  onClick,
  onHover,
  onFocus,
  onKeyDown,
  children,
  icon,
  title,
  description,
  badge,
  initialState,
  onStateChange,
  _lazyLoad = false,
  _preloadOnHover = false,
  _deferNonCriticalStyles = false,
  magneticRange = 10,
  hoverDelay = 0,
  focusDelay = 0,
  environmentalData,
  ...props
}, ref) => {
  // Generate unique card ID
  const cardId = useMemo(() => 
    `card-${variant}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    [variant]
  );

  // Card state management
  const { state, transitionState } = useCardState(cardId, initialState);

  // Handle state changes
  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Generate CSS classes based on props and state
  const cardClasses = useMemo(() => {
    const classes = [
      // Base classes
      'card-base',
      'card-container',
      
      // Variant-specific styling
      `card-variant-${variant}`,
      
      // Context adaptation
      `card-context-${context}`,
      
      // Interaction mode optimization
      `card-interaction-${interactionMode}`,
      
      // Importance hierarchy
      `card-importance-${importance}`,
      
      // Rotation type styling
      rotationType && `card-rotation-${rotationType.replace('/', '-')}`,
      
      // Day type styling
      dayType && `card-day-${dayType}`,
      
      // Feature flags - simplified for mobile
      glassEffect && (context === 'mobile' ? 'card-glass-simple' : 'card-glass'),
      physicsEnabled && context !== 'mobile' && 'card-physics-enabled',
      magneticHover && context !== 'mobile' && 'card-magnetic',
      adaptiveContrast && 'card-adaptive-contrast',
      
      // Phase 2 enhancements - reduced on mobile
      phase2Enhanced && (context === 'mobile' ? 'card-phase2-mobile' : 'card-phase2-enhanced'),
      microInteractions && context !== 'mobile' && 'card-micro-suite',
      enhancedShadows && 'card-shadow-enhanced',
      gradientBackground && context !== 'mobile' && 'card-gradient-enhanced',
      borderEffects && context !== 'mobile' && 'card-border-enhanced card-border-glow',
      enhancedTypography && 'card-title-enhanced',
      visualIndicators && 'card-badge-enhanced',
      
      // State classes - removed card-selected to eliminate outline behavior
      state.isDisabled && 'card-disabled',
      state.isLoading && 'card-loading',
      state.hasError && 'card-error',
      
      // Accessibility classes
      'card-focusable',
      'card-interactive',
      
      // Cognitive bias optimization
      cognitiveBias && cognitiveBias !== 'none' && `card-bias-${cognitiveBias}`,
      
      // Animation state
      `card-animation-${state.animationState}`,
      
      // Custom className
      className,
    ].filter(Boolean);

    return cn(...classes);
  }, [
    variant, context, interactionMode, importance, rotationType, dayType,
    glassEffect, physicsEnabled, magneticHover, adaptiveContrast,
    phase2Enhanced, microInteractions, enhancedShadows, gradientBackground,
    borderEffects, enhancedTypography, visualIndicators,
    state, cognitiveBias, className
  ]);

  // Generate CSS variables for dynamic styling
  const cssVariables = useMemo(() => {
    const variables: Record<string, string | number> = {
      '--animation-duration': `${animationDuration}ms`,
      '--animation-easing': animationEasing,
      '--magnetic-range': `${magneticRange}px`,
    };

    // Environmental adaptations
    if (environmentalData?.ambientLight) {
      const lightMultiplier = {
        bright: 0.8,
        normal: 1.0,
        dim: 1.2,
      }[environmentalData.ambientLight];
      variables['--ambient-adjustment'] = lightMultiplier;
    }

    return variables;
  }, [animationDuration, animationEasing, magneticRange, environmentalData]);

  // Event handlers
  const handleMouseEnter = useCallback((_event: React.MouseEvent) => {
    if (state.isDisabled) return;
    
    setTimeout(() => {
      transitionState({ isHovered: true });
      onHover?.(true);
    }, hoverDelay);
  }, [state.isDisabled, transitionState, onHover, hoverDelay]);

  const handleMouseLeave = useCallback((_event: React.MouseEvent) => {
    transitionState({ isHovered: false });
    onHover?.(false);
  }, [transitionState, onHover]);

  const handleFocus = useCallback((_event: React.FocusEvent) => {
    if (state.isDisabled) return;
    
    setTimeout(() => {
      transitionState({ isFocused: true });
      onFocus?.(true);
    }, focusDelay);
  }, [state.isDisabled, transitionState, onFocus, focusDelay]);

  const handleBlur = useCallback((_event: React.FocusEvent) => {
    transitionState({ isFocused: false });
    onFocus?.(false);
  }, [transitionState, onFocus]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (state.isDisabled) return;
    
    // Remove toggle functionality - cards should not toggle selection state
    // Just call the onClick handler without changing selection state
    onClick?.(event);
  }, [state.isDisabled, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (state.isDisabled) return;
    
    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event as unknown as React.MouseEvent);
    }
    
    onKeyDown?.(event);
  }, [state.isDisabled, handleClick, onKeyDown]);

  // ARIA attributes
  const ariaProps = useMemo(() => ({
    'aria-label': ariaLabel || title,
    'aria-description': ariaDescription || description,
    'aria-selected': ariaSelected ?? state.isSelected,
    'aria-expanded': ariaExpanded,
    'aria-disabled': state.isDisabled,
    'aria-busy': state.isLoading,
    'role': variant === 'rotation-selection' ? 'option' : 'button',
    'tabIndex': state.isDisabled ? -1 : 0,
    'data-card-variant': variant,
    'data-card-context': context,
    'data-card-rotation': rotationType,
    'data-card-day-type': dayType,
    'data-interaction-hint': getInteractionHint(variant, interactionMode),
    'data-additional-info': getAdditionalInfo(rotationType, dayType),
  }), [
    ariaLabel, title, ariaDescription, description, ariaSelected, ariaExpanded,
    state.isSelected, state.isDisabled, state.isLoading, variant, context,
    rotationType, dayType, interactionMode
  ]);

  return (
    <div
      ref={ref}
      className={cardClasses}
      style={{ ...cssVariables, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...ariaProps}
      {...props}
    >
      {/* Card content */}
      <div className="card-content">
        {/* Icon */}
        {icon && (
          <div className="card-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        
        {/* Main content */}
        <div className="card-main">
          {/* Title */}
          {title && (
            <h3 className="card-title">
              {title}
            </h3>
          )}
          
          {/* Description */}
          {description && (
            <p className="card-description">
              {description}
            </p>
          )}
          
          {/* Children */}
          {children}
        </div>
        
        {/* Badge */}
        {badge && (
          <div className="card-badge" aria-label={`Badge: ${badge}`}>
            {badge}
          </div>
        )}
      </div>
      
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.isSelected && 'Selected'}
        {state.isLoading && 'Loading'}
        {state.hasError && 'Error'}
      </div>
    </div>
  );
});

SmartCard.displayName = 'SmartCard';

// Helper functions
function getInteractionHint(variant: string, interactionMode: string): string {
  const hints = {
    'rotation-selection': {
      'touch': 'Tap to select this rotation pattern',
      'mouse': 'Click to select this rotation pattern',
      'keyboard': 'Press Enter or Space to select this rotation pattern',
      'voice': 'Say select to choose this rotation pattern',
    },
    'date-picker': {
      'touch': 'Tap to open date picker',
      'mouse': 'Click to open date picker',
      'keyboard': 'Press Enter to open date picker',
      'voice': 'Say open to access date picker',
    },
    'day-display': {
      'touch': 'Tap to view day details',
      'mouse': 'Click to view day details',
      'keyboard': 'Press Enter to view day details',
      'voice': 'Say details to view day information',
    },
  };
  
  return hints[variant as keyof typeof hints]?.[interactionMode as keyof typeof hints[keyof typeof hints]] || 'Interactive element';
}

function getAdditionalInfo(rotationType?: RotationType, dayType?: DayType): string {
  const info = [];
  
  if (rotationType) {
    const rotationInfo = {
      '14/21': '14 days work, 21 days off rotation',
      '28/28': '28 days work, 28 days off rotation',
      '14/14': '14 days work, 14 days off rotation',
      '15/20': '15 days work, 20 days off rotation',
      'Custom': 'Custom rotation pattern',
    };
    info.push(rotationInfo[rotationType]);
  }
  
  if (dayType) {
    const dayInfo = {
      'work': 'Work day',
      'off': 'Off day', 
      'transition': 'Transition day',
      'non-rotation': 'Day before rotation starts',
    };
    info.push(dayInfo[dayType]);
  }
  
  return info.join(', ');
}

export default SmartCard;
