/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Archivo carries the display role: it has a real 100 weight and a
        // width axis, which is what the hero's pressure effect rides on.
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        term: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      // Preflight otherwise defaults every element's border-color to a bluish
      // gray (#e5e7eb), which leaks through any bare `border` utility.
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      boxShadow: {
        neon: '0 0 24px -6px rgba(255,255,255,0.28)',
        'neon-lg': '0 0 60px -12px rgba(255,255,255,0.34)',
        'neon-hot': '0 0 30px -4px rgba(255,255,255,0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'grid-move': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(52px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'beam-run': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        scan: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '0 100vh' },
        },
        flicker: {
          '0%, 19%, 21%, 55%, 57%, 100%': { opacity: '1' },
          '20%, 56%': { opacity: '0.4' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        'grid-move': 'grid-move 1.4s linear infinite',
        'spin-slow': 'spin-slow 26s linear infinite',
        'beam-run': 'beam-run 8s linear infinite',
        scan: 'scan 10s linear infinite',
        flicker: 'flicker 3.5s linear infinite',
        blink: 'blink 1.05s step-end infinite',
      },
    },
  },
  plugins: [],
}
