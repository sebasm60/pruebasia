/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        bounceUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(5px)' },
          '75%': { transform: 'translateY(-5px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
      },
      animation: {
        bounceUp: 'bounceUp 0.6s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        shine: 'shine 1.2s ease-in-out infinite',
        ripple: 'ripple 0.6s ease-out',
      },
    },
    fontSize: {
      sm: '0.70rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
}

