/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        'primary-glow': 'rgba(59,130,246,0.25)',
        'electric-ink': '#6366F1',
        'bg': '#0D1117',
        'surface': '#FFFFFF0D',
        'light-primary': '#2563EB',
        'light-ink': '#4F46E5',
        'light-bg': '#F4F6F8',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['DM Mono', 'monospace'],
      },
      fontSize: {
        'display': 'clamp(2.4rem, 4vw, 4rem)',
        'heading': '1.25rem',
        'body': '1rem',
      },
      animation: {
        'galaxy-rotate': 'rotate 60s linear infinite',
        'hero-hover': 'scale 200ms cubic-bezier(.21,.68,.19,1.01)',
        'step-complete': 'stepUp 300ms cubic-bezier(.17,.67,.83,.67)',
        'focus-ring': 'focusIn 90ms ease-out',
        'toast-error': 'toastSlide 260ms cubic-bezier(.34,1.56,.64,1)',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        stepUp: {
          '0%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
        focusIn: {
          '0%': { outlineWidth: '0px' },
          '100%': { outlineWidth: '4px' },
        },
        toastSlide: {
          '0%': { transform: 'translateY(80px)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.6)' 
          },
          '50%': { 
            boxShadow: '0 0 0 6px rgba(59, 130, 246, 0)' 
          }
        },
      },
      transitionDuration: {
        '90': '90ms',
        '180': '180ms',
        '200': '200ms',
        '260': '260ms',
        '300': '300ms',
      },
      screens: {
        'xs': '320px',
        'sm': '768px',
        'md': '1024px',
        'lg': '1440px',
      }
    },
  },
  plugins: [],
}