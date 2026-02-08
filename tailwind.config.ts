import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'lucky-primary': '#6366F1',
        'lucky-primary-hover': '#4F46E5',
        'lucky-secondary': '#8B5CF6',
        'lucky-accent': '#F59E0B',
        'lucky-accent-hover': '#D97706',
        'lucky-surface': '#FFFFFF',
        'lucky-surface-hover': '#F3F4F6',
        'lucky-surface-elevated': '#FFFFFF',
        'lucky-background': '#F8FAFC',
        'lucky-text': '#1F2937',
        'lucky-text-muted': '#6B7280',
        'lucky-border': '#E5E7EB',
        'lucky-gold': '#FBBF24',
        'lucky-gold-hover': '#F59E0B',
        'lucky-success': '#10B981',
        'lucky-error': '#EF4444',
        'lucky-info': '#3B82F6',
        'lucky-warning': '#F59E0B',
        'lucky-ball-white': '#FFFFFF',
        'lucky-ball-red': '#EF4444',
        'lucky-ball-yellow': '#FBBF24',
        'lucky-ball-green': '#10B981',
        'lucky-ball-blue': '#3B82F6',
        'lucky-dark-surface': '#1F2937',
        'lucky-dark-surface-hover': '#374151',
        'lucky-dark-surface-elevated': '#111827',
        'lucky-dark-background': '#111827',
        'lucky-dark-text': '#F9FAFB',
        'lucky-dark-text-muted': '#9CA3AF',
        'lucky-dark-border': '#374151',
      },
      keyframes: {
        'spin-ball': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'ball-bounce': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'sparkle-fly': {
          '0%': { 
            transform: 'translate(-50%, -50%) scale(1)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translate(calc(-50% + var(--sparkle-x, 30px)), calc(-50% + var(--sparkle-y, -30px))) scale(0)', 
            opacity: '0' 
          },
        },
      },
      animation: {
        'spin-ball': 'spin-ball 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out',
        'ball-bounce': 'ball-bounce 0.4s ease-out',
        'sparkle-fly': 'sparkle-fly 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
