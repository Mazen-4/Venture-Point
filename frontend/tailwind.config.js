/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    'golden-frame'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Match Navbar/Footer/Home colors used across components
        navy: '#2F3A36', // Navbar & footer background
        'navy-dark': '#27312f',

        // Primary / Brand blues seen in components
        primary: {
          50: '#f3f9ff',
          100: '#e6f3ff',
          200: '#cfe9fb',
          300: '#9fd7f1',
          400: '#4295bd', // buttons (Home CTAs)
          500: '#3F93E6', // navbar active / link accent
          600: '#3584ab', // hover / active
          700: '#244E77',
          800: '#124b78',
          900: '#0f3550',
        },

        // Emerald / Green accents used in particles and graphics
        emerald: {
          50: '#ecf9f1',
          100: '#dff3e6',
          200: '#bfe7cc',
          300: '#7fd59a',
          400: '#4cb86c',
          500: '#2E7D32',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },

        // Gold accents (particles, frames)
        
        gold: '#208d12ff',
        // Secondary / neutral grays
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },

        // Semantic / helper colors
        background: {
          DEFAULT: '#ffffff',
          dark: '#2F3A36',
          light: '#f8fafc',
          gray: '#e8f1f7',
        },

        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
          inverse: '#ffffff',
        },

        // Convenience aliases used in code
        'steel-blue': '#4295bd',
        'brand-blue': '#3F93E6',
        'brand-blue-dark': '#3584ab',
      },
      
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'section-title': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'card-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
        'strong': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'glow-blue': '0 0 20px rgba(59, 139, 201, 0.3)',
        'glow-teal': '0 0 20px rgba(20, 184, 154, 0.3)',
      },
      
      // Removed custom gradient background images to disable gradients
      
      keyframes: {
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-right': {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'scale-in': {
          '0%': { 
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}