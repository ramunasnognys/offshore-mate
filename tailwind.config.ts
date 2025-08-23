import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Enhanced card system colors
  			rotation: {
  				'14-21': {
  					primary: 'var(--color-rotation-14-21-primary)',
  					bg: 'var(--color-rotation-14-21-bg)',
  					'bg-hover': 'var(--color-rotation-14-21-bg-hover)',
  					border: 'var(--color-rotation-14-21-border)',
  					'border-hover': 'var(--color-rotation-14-21-border-hover)',
  					text: 'var(--color-rotation-14-21-text)'
  				},
  				'28-28': {
  					primary: 'var(--color-rotation-28-28-primary)',
  					bg: 'var(--color-rotation-28-28-bg)',
  					'bg-hover': 'var(--color-rotation-28-28-bg-hover)',
  					border: 'var(--color-rotation-28-28-border)',
  					'border-hover': 'var(--color-rotation-28-28-border-hover)',
  					text: 'var(--color-rotation-28-28-text)'
  				},
  				'14-14': {
  					primary: 'var(--color-rotation-14-14-primary)',
  					bg: 'var(--color-rotation-14-14-bg)',
  					'bg-hover': 'var(--color-rotation-14-14-bg-hover)',
  					border: 'var(--color-rotation-14-14-border)',
  					'border-hover': 'var(--color-rotation-14-14-border-hover)',
  					text: 'var(--color-rotation-14-14-text)'
  				},
  				'15-20': {
  					primary: 'var(--color-rotation-15-20-primary)',
  					bg: 'var(--color-rotation-15-20-bg)',
  					'bg-hover': 'var(--color-rotation-15-20-bg-hover)',
  					border: 'var(--color-rotation-15-20-border)',
  					'border-hover': 'var(--color-rotation-15-20-border-hover)',
  					text: 'var(--color-rotation-15-20-text)'
  				},
  				custom: {
  					primary: 'var(--color-rotation-custom-primary)',
  					bg: 'var(--color-rotation-custom-bg)',
  					'bg-hover': 'var(--color-rotation-custom-bg-hover)',
  					border: 'var(--color-rotation-custom-border)',
  					'border-hover': 'var(--color-rotation-custom-border-hover)',
  					text: 'var(--color-rotation-custom-text)'
  				}
  			},
  			day: {
  				work: {
  					primary: 'var(--color-work-primary)',
  					bg: 'var(--color-work-bg)',
  					'bg-hover': 'var(--color-work-bg-hover)',
  					border: 'var(--color-work-border)',
  					'border-hover': 'var(--color-work-border-hover)',
  					text: 'var(--color-work-text)'
  				},
  				off: {
  					primary: 'var(--color-off-primary)',
  					bg: 'var(--color-off-bg)',
  					'bg-hover': 'var(--color-off-bg-hover)',
  					border: 'var(--color-off-border)',
  					'border-hover': 'var(--color-off-border-hover)',
  					text: 'var(--color-off-text)'
  				},
  				transition: {
  					primary: 'var(--color-transition-primary)',
  					bg: 'var(--color-transition-bg)',
  					'bg-hover': 'var(--color-transition-bg-hover)',
  					border: 'var(--color-transition-border)',
  					'border-hover': 'var(--color-transition-border-hover)',
  					text: 'var(--color-transition-text)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  			display: ['var(--font-dela-gothic)', 'system-ui', 'sans-serif'],
  		},
  		// Enhanced animation system
  		animation: {
  			'card-hover-physics': 'cardHoverPhysics 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'selection-spring': 'selectionSpring 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'magnetic-field': 'magneticField 0.3s ease',
  			'card-loading': 'cardLoading 1.5s infinite',
  			'loading-indicator': 'loadingIndicator 1.5s infinite',
  			'glass-shimmer': 'glassShimmer 2s ease-in-out infinite',
  		},
  		keyframes: {
  			cardHoverPhysics: {
  				'0%': { transform: 'scale(1)' },
  				'30%': { transform: 'scale(1.05) rotateX(2deg) rotateY(1deg)' },
  				'60%': { transform: 'scale(0.98) rotateX(-1deg) rotateY(-0.5deg)' },
  				'100%': { transform: 'scale(1.02) rotateX(1deg) rotateY(0.5deg)' },
  			},
  			selectionSpring: {
  				'0%': { transform: 'scale(1)' },
  				'30%': { transform: 'scale(1.05)' },
  				'60%': { transform: 'scale(0.98)' },
  				'100%': { transform: 'scale(1)' },
  			},
  			magneticField: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			cardLoading: {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(100%)' },
  			},
  			loadingIndicator: {
  				'0%': { left: '-100%' },
  				'100%': { left: '100%' },
  			},
  			glassShimmer: {
  				'0%, 100%': { transform: 'translateX(-100%) skewX(-15deg)' },
  				'50%': { transform: 'translateX(100%) skewX(-15deg)' },
  			},
  		},
  		// Enhanced transitions
  		transitionTimingFunction: {
  			'spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
  			'in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  		},
  		// Container query responsive spacing
  		spacing: {
  			'card-xs': 'clamp(0.5rem, 2cqi, 0.75rem)',
  			'card-sm': 'clamp(0.75rem, 3cqi, 1rem)',
  			'card-md': 'clamp(1rem, 4cqi, 1.5rem)',
  			'card-lg': 'clamp(1.5rem, 5cqi, 2rem)',
  			'card-xl': 'clamp(2rem, 6cqi, 3rem)',
  		},
  		// Enhanced shadows
  		boxShadow: {
  			'glass-subtle': 'var(--shadow-subtle), inset 0 1px 0 rgba(255,255,255,0.1)',
  			'glass-soft': 'var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,0.2)',
  			'glass-medium': 'var(--shadow-medium), inset 0 1px 0 rgba(255,255,255,0.2)',
  			'glass-bold': 'var(--shadow-bold), inset 0 1px 0 rgba(255,255,255,0.3)',
  			'card-hover': '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
  			'card-active': '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
  		},
  		// Backdrop blur utilities
  		backdropBlur: {
  			'glass': 'var(--glass-blur)',
  			'glass-light': 'calc(var(--glass-blur) * 0.5)',
  			'glass-heavy': 'calc(var(--glass-blur) * 1.5)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/container-queries')],
} satisfies Config;
