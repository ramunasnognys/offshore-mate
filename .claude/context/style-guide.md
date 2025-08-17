# Style Guide - Offshore Mate

## Design System Overview

This style guide defines the visual language and design patterns for the Offshore Mate application.

## Color Palette

### Primary Colors
- **Brand Blue**: Used for primary actions and key elements
- **Success Green**: For positive actions and confirmations
- **Warning Amber**: For cautions and important notices
- **Error Red**: For errors and destructive actions

### Neutral Colors
- **Gray Scale**: 7-step scale for text, backgrounds, and borders
- **Pure White**: Background color for light mode
- **Pure Black**: Text color for high contrast

### Dark Mode
- Corresponding accessible dark mode palette
- All color combinations meet WCAG AA contrast ratios

## Typography

### Font Family
- **Primary**: Inter (clean, legible sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif

### Type Scale
- **H1**: 32px - Page titles
- **H2**: 24px - Section headers
- **H3**: 20px - Subsection headers
- **H4**: 18px - Component headers
- **Body Large**: 16px - Emphasized text
- **Body Medium**: 14px - Default body text
- **Body Small**: 12px - Captions and fine print

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **SemiBold**: 600 - Headings
- **Bold**: 700 - Strong emphasis

## Spacing System

### Base Unit
- **Base**: 8px (0.5rem)

### Spacing Scale
- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 12px (0.75rem)
- **LG**: 16px (1rem)
- **XL**: 24px (1.5rem)
- **2XL**: 32px (2rem)
- **3XL**: 48px (3rem)

## Border Radius

### Radius Scale
- **Small**: 4px - Buttons, inputs
- **Medium**: 8px - Cards, modals
- **Large**: 12px - Large containers
- **Round**: 50% - Avatar, icon buttons

## Component Guidelines

### Buttons
- Primary: Solid background with brand color
- Secondary: Outlined with subtle background
- Ghost: Text only with hover state
- Destructive: Red color for delete/remove actions

### Forms
- Clear labels and placeholders
- Consistent input heights (40px)
- Error states with red borders and messages
- Success states with green indicators

### Cards
- Subtle shadows for depth
- Consistent padding (16px-24px)
- Rounded corners (8px)
- Clear content hierarchy

### Navigation
- Persistent left sidebar for main navigation
- Breadcrumbs for deep navigation
- Active states clearly indicated

## Accessibility Standards

### Contrast Requirements
- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio
- UI elements: 3:1 minimum contrast ratio

### Keyboard Navigation
- All interactive elements accessible via keyboard
- Clear focus indicators
- Logical tab order

### Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels
- Alt text for images

## Animation Guidelines

### Timing
- **Fast**: 150ms - Micro-interactions
- **Standard**: 250ms - Component transitions
- **Slow**: 350ms - Page transitions

### Easing
- **Ease-in-out**: Standard for most animations
- **Ease-out**: For elements entering the view
- **Ease-in**: For elements leaving the view

## Grid System

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Layout
- 12-column grid system
- Responsive margins and gutters
- Mobile-first approach

## Icon System

### Style
- Outline style icons
- 24px default size
- Consistent stroke width (1.5px)
- Round line caps

### Usage
- Always provide alt text
- Use SVG format
- Maintain consistent visual weight

---

*This style guide should be referenced for all design decisions and regularly updated as the design system evolves.*