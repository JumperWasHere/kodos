import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // KidOS Custom Brand Colors
        kidos: {
          purple: '#7C3AED',
          'purple-light': '#A855F7',
          pink: '#EC4899',
          'pink-light': '#F472B6',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#22C55E',
          teal: '#14B8A6',
          blue: '#3B82F6',
          'blue-light': '#60A5FA',
          red: '#EF4444',
          indigo: '#6366F1',
        },
        subject: {
          math: '#3B82F6',
          english: '#8B5CF6',
          science: '#10B981',
          bm: '#F59E0B',
          mandarin: '#EF4444',
          geography: '#06B6D4',
          history: '#78716C',
          art: '#EC4899',
          ict: '#6366F1',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-fredoka)', 'Fredoka One', 'cursive'],
        body: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'subject-math': 'linear-gradient(135deg, #3B82F6, #2563EB)',
        'subject-english': 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        'subject-science': 'linear-gradient(135deg, #10B981, #059669)',
        'subject-bm': 'linear-gradient(135deg, #F59E0B, #D97706)',
        'subject-mandarin': 'linear-gradient(135deg, #EF4444, #DC2626)',
        'subject-geo': 'linear-gradient(135deg, #06B6D4, #0891B2)',
        'subject-history': 'linear-gradient(135deg, #78716C, #57534E)',
        'subject-art': 'linear-gradient(135deg, #EC4899, #DB2777)',
        'subject-ict': 'linear-gradient(135deg, #6366F1, #4F46E5)',
      },
      boxShadow: {
        'kid-sm': '0 2px 8px rgba(124, 58, 237, 0.15)',
        'kid-md': '0 4px 16px rgba(124, 58, 237, 0.2)',
        'kid-lg': '0 8px 32px rgba(124, 58, 237, 0.25)',
        'kid-xl': '0 16px 48px rgba(124, 58, 237, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.4)',
        'card': '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1.5s',
        'confetti': 'confetti 0.5s ease-out forwards',
        'star-pop': 'star-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'xp-fill': 'xp-fill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'coin-flip': 'coin-flip 0.6s ease-out',
        'rainbow': 'rainbow 3s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'star-pop': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'xp-fill': {
          from: { width: '0%' },
          to: { width: 'var(--xp-width)' },
        },
        'coin-flip': {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(720deg)' },
        },
        rainbow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'kid': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssTypography,
  ],
}

export default config
