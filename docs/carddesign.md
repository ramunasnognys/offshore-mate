# Work Rotation Pattern Cards Specification

## Overview

This document defines the card styling system specifically for work rotation patterns in the Offshore Mate application. The system provides visual differentiation between different rotation schedules using color-coded isometric cards with glass morphism effects.

## Rotation Types & Color Schemes

### 1. **14/21 Rotation** - Blue Theme
**Pattern:** 14 days work, 21 days off
**Primary Color:** Blue (`#3B82F6`)
**Usage:** Standard offshore rotation for oil & gas industry

**Visual Properties:**
- Background: Blue gradient (`bg-blue-500/20` to `bg-blue-500/30`)
- Border: `border-blue-500/30` with hover `border-blue-500/50`
- Text: `text-blue-900`
- Icon tint: Blue variants
- Shadow: Blue-tinted shadows with depth

**CSS Classes:**
\`\`\`css
.isometric-blue
.glass-button-blue
\`\`\`

### 2. **28/28 Rotation** - Purple Theme
**Pattern:** 28 days work, 28 days off
**Primary Color:** Purple (`#8B5CF6`)
**Usage:** Extended rotation for remote locations

**Visual Properties:**
- Background: Purple gradient (`bg-purple-500/20` to `bg-purple-500/30`)
- Border: `border-purple-500/30` with hover `border-purple-500/50`
- Text: `text-purple-900`
- Icon tint: Purple variants
- Shadow: Purple-tinted shadows with depth

**CSS Classes:**
\`\`\`css
.isometric-purple
.glass-button-purple
\`\`\`

### 3. **14/14 Rotation** - Green Theme
**Pattern:** 14 days work, 14 days off
**Primary Color:** Emerald (`#10B981`)
**Usage:** Balanced rotation schedule

**Visual Properties:**
- Background: Green gradient (`bg-emerald-500/20` to `bg-emerald-500/30`)
- Border: `border-emerald-500/30` with hover `border-emerald-500/50`
- Text: `text-emerald-900`
- Icon tint: Green variants
- Shadow: Green-tinted shadows with depth

**CSS Classes:**
\`\`\`css
.isometric-green
.glass-button-green
\`\`\`

### 4. **15/20 Rotation** - Orange Theme
**Pattern:** 15 days work, 20 days off
**Primary Color:** Orange (`#F97316`)
**Usage:** Custom rotation pattern

**Visual Properties:**
- Background: Orange gradient (`bg-orange-500/20` to `bg-orange-500/30`)
- Border: `border-orange-500/30` with hover `border-orange-500/50`
- Text: `text-orange-900`
- Icon tint: Orange variants
- Shadow: Orange-tinted shadows with depth

**CSS Classes:**
\`\`\`css
.isometric-orange
.glass-button-orange
\`\`\`

### 5. **Custom Rotations** - Teal/Rose Themes
**Additional color variants for custom patterns:**

**Teal Theme (`#14B8A6`):**
\`\`\`css
.isometric-teal
.glass-button-teal
\`\`\`

**Rose Theme (`#F43F5E`):**
\`\`\`css
.isometric-rose
.glass-button-rose
\`\`\`

## Card Day Type Styling

### Work Days
**Visual Identifier:** Wrench icon (`<Wrench />`)
**Styling:**
- Background: `bg-amber-400/60`
- Border: `border-2 border-amber-500/60`
- Text: `text-amber-900`
- Hover: `hover:bg-amber-400/70`
- Shadow: Amber-tinted depth shadows

### Off Days
**Visual Identifier:** Waves icon (`<Waves />`)
**Styling:**
- Background: `bg-cyan-400/60`
- Border: `border-2 border-cyan-500/60`
- Text: `text-cyan-900`
- Hover: `hover:bg-cyan-400/70`
- Shadow: Cyan-tinted depth shadows

### Transition Days
**Visual Identifier:** Star icon (`<Star />`)
**Styling:**
- Background: `bg-purple-400/60`
- Border: `border-2 border-purple-500/60`
- Text: `text-purple-900`
- Hover: `hover:bg-purple-400/70`
- Shadow: Purple-tinted depth shadows

### Today Indicator
**Special styling for current date:**
- Background: `bg-slate-900`
- Text: `text-white`
- Font: `font-bold`
- Shadow: Enhanced depth with `shadow-lg`

## Interactive Card Components

### Rotation Selection Cards
**Base Structure:**
\`\`\`jsx
<button className="isometric-micro focus-enhanced p-6 rounded-xl w-full text-left hover:bg-white/40 transition-all duration-300">
  <div className="flex items-center gap-4 mb-4">
    <div className="p-2 bg-slate-100/50 rounded-lg">
      <Icon className="h-6 w-6 text-slate-700" />
    </div>
    <div>
      <h4 className="font-serif font-semibold text-lg text-slate-900">
        {rotationType} Rotation
      </h4>
      <p className="text-sm text-slate-600">
        {description}
      </p>
    </div>
  </div>
  <div className="radio-enhanced selected" />
</button>
\`\`\`

### Calendar Day Cards
**Base Structure:**
\`\`\`jsx
<div className={`
  aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center 
  text-xs sm:text-sm font-medium min-h-[44px] sm:min-h-[48px]
  ${getDayStyles(day, dayType)}
  cursor-pointer isometric-micro
`}>
  <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
    {getDayIcon(dayType)}
  </div>
  <span className={isToday ? "font-bold" : ""}>{day}</span>
</div>
\`\`\`

## Layout Patterns

### Rotation Grid Layout
\`\`\`jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  {rotationOptions.map((rotation) => (
    <RotationCard key={rotation.type} {...rotation} />
  ))}
</div>
\`\`\`

### Calendar Grid Layout
\`\`\`jsx
<div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 sm:mb-8" role="grid">
  {days.map((day, index) => (
    <CalendarDayCard key={index} day={day} />
  ))}
</div>
\`\`\`

### Legend Layout
\`\`\`jsx
<div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 border-t border-white/20 flex-wrap">
  <LegendItem icon={Wrench} color="amber" label="Work" />
  <LegendItem icon={Waves} color="cyan" label="Off" />
  <LegendItem icon={Star} color="purple" label="Transition" />
</div>
\`\`\`

## Animation & Transitions

### Hover Effects
- **Scale Transform:** `hover:scale-105`
- **Background Opacity:** Increase by 10-20%
- **Shadow Enhancement:** Deeper, more pronounced shadows
- **Duration:** `transition-all duration-300`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

### Focus States
- **Ring Outline:** `focus:ring-2 focus:ring-slate-900`
- **Ring Offset:** `focus:ring-offset-2 focus:ring-offset-white/50`
- **Enhanced Visibility:** Clear focus indicators for accessibility

### Selection States
- **Background Change:** Increased opacity and saturation
- **Border Enhancement:** Thicker, more prominent borders
- **Radio Button:** Custom styled radio with inner dot

## Responsive Design

### Mobile Adaptations
- **Reduced Padding:** `p-4` instead of `p-6`
- **Smaller Icons:** `h-4 w-4` instead of `h-6 w-6`
- **Adjusted Gaps:** `gap-3` instead of `gap-4`
- **Font Scaling:** `text-sm` instead of `text-base`

### Tablet & Desktop Enhancements
- **Larger Touch Targets:** Minimum 44px height
- **Enhanced Shadows:** More pronounced depth effects
- **Increased Spacing:** More generous whitespace
- **Larger Typography:** Better readability at distance

## Accessibility Features

### ARIA Support
- **Role Attributes:** `role="grid"`, `role="gridcell"`, `role="button"`
- **Labels:** Comprehensive `aria-label` descriptions
- **Live Regions:** `aria-live="polite"` for dynamic updates
- **Current State:** `aria-current="date"` for today indicator

### Keyboard Navigation
- **Tab Order:** Logical focus sequence
- **Arrow Keys:** Calendar navigation support
- **Home/End Keys:** Jump to first/last dates
- **Enter/Space:** Activation of interactive elements

### Screen Reader Support
- **Descriptive Labels:** Full context for each rotation type
- **Status Announcements:** Changes in selection state
- **Instructions:** Clear usage guidance
- **Alternative Text:** Icon descriptions when needed

## Color Contrast Compliance

### WCAG AA Standards
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text:** Minimum 3:1 contrast ratio
- **Interactive Elements:** Clear visual distinction
- **Focus Indicators:** High contrast outlines

### Color Combinations Tested
- **Blue on White:** ✅ AA Compliant
- **Purple on White:** ✅ AA Compliant  
- **Green on White:** ✅ AA Compliant
- **Orange on White:** ✅ AA Compliant
- **Dark Text on Light Backgrounds:** ✅ AA Compliant

## Implementation Guidelines

### Do's
- **Consistent Spacing:** Use established spacing scale
- **Proper Semantic HTML:** Use appropriate elements
- **Color Psychology:** Match colors to rotation intensity
- **Progressive Enhancement:** Work without JavaScript
- **Touch-Friendly:** Adequate touch target sizes

### Don'ts
- **Mix Color Schemes:** Don't combine rotation themes
- **Override Focus States:** Maintain accessibility
- **Use Color Alone:** Include icons for differentiation
- **Ignore Mobile:** Ensure responsive behavior
- **Skip Testing:** Verify with real users

## Performance Considerations

### CSS Optimization
- **Minimal Repaints:** Use transform for animations
- **GPU Acceleration:** Leverage hardware acceleration
- **Efficient Selectors:** Avoid complex CSS selectors
- **Reduced Motion:** Respect user preferences

### Bundle Size
- **Tree Shaking:** Remove unused styles
- **Critical CSS:** Inline essential styles
- **Lazy Loading:** Load non-critical styles asynchronously

## Browser Support

### Modern Browsers
- **Chrome 90+:** Full support
- **Firefox 88+:** Full support
- **Safari 14+:** Full support
- **Edge 90+:** Full support

### Fallbacks
- **Backdrop Filter:** Graceful degradation
- **CSS Grid:** Flexbox fallback
- **Custom Properties:** Static value fallbacks

---

## Usage Examples

### Basic Rotation Card
\`\`\`jsx
<div className="isometric-blue p-6 rounded-xl">
  <div className="flex items-center gap-4 mb-4">
    <div className="p-2 bg-blue-100/50 rounded-lg">
      <Calendar className="h-6 w-6 text-blue-700" />
    </div>
    <div>
      <h4 className="font-serif font-semibold text-lg text-blue-900">
        14/21 Rotation
      </h4>
      <p className="text-sm text-blue-700">
        14 days work, 21 days off
      </p>
    </div>
  </div>
</div>
\`\`\`

### Calendar Day Implementation
\`\`\`jsx
const getDayStyles = (day, dayType) => {
  const baseStyles = "relative transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-900"
  
  if (day === today) {
    return `${baseStyles} bg-slate-900 text-white shadow-lg`
  }
  
  switch (dayType) {
    case "work":
      return `${baseStyles} bg-amber-400/60 text-amber-900 border-2 border-amber-500/60`
    case "off":
      return `${baseStyles} bg-cyan-400/60 text-cyan-900 border-2 border-cyan-500/60`
    case "transition":
      return `${baseStyles} bg-purple-400/60 text-purple-900 border-2 border-purple-500/60`
    default:
      return baseStyles
  }
}
\`\`\`

This specification ensures consistent, accessible, and visually appealing work rotation pattern cards throughout the Offshore Mate application.
