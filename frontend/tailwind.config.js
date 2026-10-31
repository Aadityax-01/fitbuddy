/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'midnight-card': '#0b1329',
        'midnight-surface': '#0f172a',
        'midnight-border': '#1e293b',
        'card-bg': '#0b1329',
        'card-elevated': '#0f172a',
        'card-border': '#1e293b',
        'card-hover': '#1e293b',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C4C4C4',
        'text-muted': '#94a3b8',
        'cyan-accent': '#06b6d4',
        'cyan-light': '#22d3ee',
        'cyan-dim': 'rgba(6, 182, 212, 0.15)',
        'blue-accent': '#3b82f6',
        'blue-dark': '#2563eb',
        'blue-dim': 'rgba(59, 130, 246, 0.15)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.2)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.2)',
        'midnight': '0 4px 20px rgba(0, 0, 0, 0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1px #1e293b' },
          '50%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};