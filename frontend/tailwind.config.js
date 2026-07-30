/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#05070D',
          50: '#0A0E18',
          100: '#0D1220',
          200: '#111828',
          300: '#161F33',
        },
        glass: {
          DEFAULT: 'rgba(15, 20, 32, 0.55)',
          border: 'rgba(96, 165, 250, 0.14)',
          highlight: 'rgba(255, 255, 255, 0.06)',
        },
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          bright: '#38BDF8',
          deep: '#1D4ED8',
          dim: '#1E3A8A',
        },
        ink: {
          DEFAULT: '#E7ECF5',
          muted: '#8792A6',
          faint: '#4B5468',
        },
        state: {
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#F87171',
        },
        district: {
          ai: '#A78BFA',
          backend: '#38BDF8',
          frontend: '#3B82F6',
          blockchain: '#FBBF24',
          security: '#F87171',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '20px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(59, 130, 246, 0.35)',
        'glow-sm': '0 0 12px rgba(59, 130, 246, 0.25)',
        'glow-lg': '0 0 48px rgba(59, 130, 246, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'led-scan': 'ledScan 3s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.55, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        ledScan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
