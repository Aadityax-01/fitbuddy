/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#FFFFFF',
        'neon-green-dim': '#E5E5E5',
        'dark-bg': '#000000',
        'card-bg': '#171717',
        'card-elevated': '#262626',
        'card-border': '#404040',
        'card-hover': '#262626',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'text-muted': '#737373',
        'muted': '#A3A3A3',
        'success': '#FFFFFF',
        'warning': '#D4D4D4',
        'danger': '#A3A3A3',
        'info': '#E5E5E5',
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
          '0%, 100%': { boxShadow: '0 0 0 1px #404040' },
          '50%': { boxShadow: '0 0 0 2px #FFFFFF' },
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)',
      },
      boxShadow: {
        'neon': '0 0 0 1px #404040',
        'neon-lg': '0 0 0 2px #FFFFFF',
        'card': '0 4px 24px rgba(0, 0, 0, 0.7)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [],
}
