/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F1F3D',
        saffron: '#FF6B35',
        'saffron-light': '#FFF0EA',
        'chat-bg': '#ECE5DD',
        'chat-bubble': '#DCF8C6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        stamp: {
          '0%': { transform: 'scale(1.4) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(-3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.35s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        stamp: 'stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        pulse: 'pulse 1.2s ease-in-out infinite',
        marquee: 'marquee 15s linear infinite',
      },
    },
  },
  plugins: [],
}
