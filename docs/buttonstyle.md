# Generate Button Styling Specification

## Overview

This document defines the styling standards and implementation guidelines for generate buttons in the Offshore Mate application. Generate buttons serve as primary call-to-action elements that initiate schedule creation and other generative processes.

## Button Types

### 1. Primary Generate Button (CTA)

The main generate schedule button serves as the primary call-to-action on the homepage.

**Visual Properties:**
- **Class**: `cta-primary`
- **Background**: Custom gradient with enhanced visual effects
- **Text Color**: White (`text-white`)
- **Padding**: Large (`px-12 py-6`)
- **Font Size**: Extra large (`text-xl`)
- **Font Weight**: Semibold (`font-semibold`)
- **Border Radius**: Full rounded (`rounded-full`)
- **Border**: None (`border-0`)
- **Shadow**: Enhanced with custom effects

**Interactive States:**
- **Hover**: Subtle scale transform and enhanced shadow
- **Focus**: Custom focus ring with enhanced styling (`focus-enhanced`)
- **Active**: Slight scale reduction for tactile feedback

**Implementation:**
\`\`\`tsx
<Button
  size="lg"
  className="cta-primary text-white px-12 py-6 text-xl font-semibold rounded-full border-0 focus-enhanced"
  aria-describedby="generate-button-description"
>
  <Waves className="h-6 w-6 mr-3" aria-hidden="true" />
  Generate Schedule
</Button>
\`\`\`

### 2. Secondary Generate Buttons

Used for additional generation actions or in modal contexts.

**Visual Properties:**
- **Base Class**: `glass-button` or `isometric-micro`
- **Background**: Semi-transparent with backdrop blur
- **Text Color**: Slate variants (`text-slate-700`, `text-slate-900`)
- **Padding**: Medium (`px-4 py-3` or `px-6 py-4`)
- **Font Size**: Base (`text-base`)
- **Font Weight**: Medium to semibold
- **Border Radius**: Rounded (`rounded-xl`)
- **Border**: Subtle white border (`border-white/30`)

**Implementation:**
\`\`\`tsx
<Button className="glass-button gap-2 text-slate-700 hover:text-slate-900 px-6 py-4 rounded-xl">
  Generate Report
</Button>
\`\`\`

### 3. Gradient Generate Buttons

Used for premium actions or export functionality.

**Visual Properties:**
- **Class**: `gradient-purple`
- **Background**: Purple gradient (`from-purple-600 to-indigo-600`)
- **Text Color**: White
- **Padding**: Medium (`px-6 py-3`)
- **Font Weight**: Semibold
- **Shadow**: Enhanced (`shadow-lg hover:shadow-xl`)
- **Transform**: Scale on hover (`hover:scale-105`)

**Implementation:**
\`\`\`tsx
<Button className="gradient-purple text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
  Generate Export
</Button>
\`\`\`

## Design Patterns

### Icon Integration

**Guidelines:**
- Always include relevant icons for generate buttons
- Use `Waves` icon for schedule generation
- Use `Download` icon for export generation
- Icon size should be `h-4 w-4` for small buttons, `h-6 w-6` for large buttons
- Icons should have `aria-hidden="true"` attribute

**Example:**
\`\`\`tsx
<Waves className="h-6 w-6 mr-3" aria-hidden="true" />
\`\`\`

### Loading States

**Implementation:**
- Replace icon with spinner during generation
- Disable button interaction
- Maintain button dimensions
- Show loading text

\`\`\`tsx
{isGenerating ? (
  <Spinner className="h-6 w-6 mr-3" aria-hidden="true" />
) : (
  <Waves className="h-6 w-6 mr-3" aria-hidden="true" />
)}
{isGenerating ? "Generating..." : "Generate Schedule"}
\`\`\`

### Responsive Behavior

**Mobile (< 768px):**
- Reduce padding: `px-8 py-4` instead of `px-12 py-6`
- Smaller text: `text-lg` instead of `text-xl`
- Smaller icons: `h-5 w-5` instead of `h-6 w-6`

**Tablet (768px - 1024px):**
- Standard sizing with slight adjustments
- Maintain full functionality

**Desktop (> 1024px):**
- Full sizing and enhanced effects
- Maximum visual impact

## Color System

### Primary Generate Button Colors

**Background Gradient:**
- Start: Custom brand color (typically purple/blue)
- End: Complementary shade
- Opacity: Full opacity for primary actions

**Text Colors:**
- Primary: White (`text-white`)
- Secondary: Slate-700 (`text-slate-700`)
- Hover: Slate-900 (`text-slate-900`)

### State-Based Colors

**Default State:**
- Background: Brand gradient or glass effect
- Text: High contrast color
- Border: Subtle or none

**Hover State:**
- Background: Slightly darker or more opaque
- Text: Enhanced contrast
- Shadow: Increased elevation

**Focus State:**
- Ring: Brand color with opacity
- Ring Width: 2px
- Ring Offset: 2px

**Disabled State:**
- Background: Muted gray (`bg-slate-400/50`)
- Text: Reduced contrast (`text-slate-500`)
- Cursor: Not allowed

## Accessibility Requirements

### ARIA Labels

**Required Attributes:**
- `aria-describedby`: Link to description element
- `aria-label`: When button text isn't descriptive enough
- `aria-expanded`: For buttons that toggle content
- `aria-pressed`: For toggle-style generate buttons

**Example:**
\`\`\`tsx
<Button
  aria-describedby="generate-button-description"
  aria-label="Generate offshore work schedule"
>
  Generate Schedule
</Button>
<div id="generate-button-description" className="sr-only">
  Generate your offshore work schedule based on selected start date and rotation
</div>
\`\`\`

### Keyboard Navigation

**Requirements:**
- Tab navigation support
- Enter/Space key activation
- Focus indicators must be visible
- Focus ring should be prominent

### Screen Reader Support

**Guidelines:**
- Descriptive button text
- Hidden descriptions for context
- Status announcements for loading states
- Clear success/error feedback

## Animation and Transitions

### Hover Effects

**Transform:**
\`\`\`css
transform: scale(1.05);
transition: transform 0.3s ease;
\`\`\`

**Shadow Enhancement:**
\`\`\`css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
transition: box-shadow 0.3s ease;
\`\`\`

### Click Feedback

**Active State:**
\`\`\`css
transform: scale(0.98);
transition: transform 0.1s ease;
\`\`\`

### Loading Animation

**Spinner Rotation:**
\`\`\`css
animation: spin 1s linear infinite;
\`\`\`

## Implementation Guidelines

### CSS Classes

**Primary Generate Button:**
\`\`\`css
.cta-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
}

.cta-primary:active {
  transform: translateY(0) scale(0.98);
}
\`\`\`

**Glass Generate Button:**
\`\`\`css
.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
\`\`\`

### React Component Pattern

\`\`\`tsx
interface GenerateButtonProps {
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaDescribedBy?: string;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  onClick,
  disabled,
  ariaDescribedBy,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'cta-primary text-white';
      case 'secondary':
        return 'glass-button text-slate-700 hover:text-slate-900';
      case 'gradient':
        return 'gradient-purple text-white';
      default:
        return 'cta-primary text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-12 py-6 text-xl';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <Button
      className={`${getVariantClasses()} ${getSizeClasses()} font-semibold rounded-xl transition-all duration-300 focus-enhanced`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {isLoading ? (
        <Spinner className="h-5 w-5 mr-2" aria-hidden="true" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {isLoading ? 'Generating...' : children}
    </Button>
  );
};
\`\`\`

## Usage Examples

### Homepage CTA
\`\`\`tsx
<GenerateButton
  variant="primary"
  size="lg"
  icon={<Waves className="h-6 w-6" />}
  ariaDescribedBy="generate-schedule-description"
>
  Generate Schedule
</GenerateButton>
\`\`\`

### Modal Action
\`\`\`tsx
<GenerateButton
  variant="gradient"
  size="md"
  icon={<Download className="h-4 w-4" />}
  isLoading={isExporting}
>
  Generate Export
</GenerateButton>
\`\`\`

### Secondary Action
\`\`\`tsx
<GenerateButton
  variant="secondary"
  size="sm"
  icon={<RefreshCw className="h-4 w-4" />}
>
  Regenerate
</GenerateButton>
\`\`\`

## Testing Guidelines

### Visual Testing
- Test all variants across different screen sizes
- Verify hover and focus states
- Check color contrast ratios (minimum 4.5:1)
- Validate loading states

### Functional Testing
- Keyboard navigation
- Screen reader compatibility
- Click/tap responsiveness
- Loading state behavior

### Performance Testing
- Animation smoothness
- Transition timing
- Resource loading impact

## Maintenance Notes

- Review button styles quarterly for consistency
- Update color values when brand guidelines change
- Test accessibility compliance with each update
- Monitor performance impact of animations
- Keep icon library updated and consistent

---

*Last updated: January 2025*
*Version: 1.0*
