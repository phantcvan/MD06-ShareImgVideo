/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      blue: '#3355FF',
      red: '#FF0202',
      'gray-1': '#DBDBDB',
      'gray-text-w': '#737373',
      'gray-text-b': '#8F8F8F',
      'gray-hover': '#F2F2F2',
      'gray-hover-dark': '#1A1A1A',
      'gray-input': 'rgb(250,250,250)',
      'gray-hover-w': '#FAFAFA',
      'gray-hover-b': '#121212',
      'gray-setting': '#262626',
      'gray-btn-b': '#363636',
      'gray-btn-w': '#EFEFEF',
      'overlay-20': 'rgba(241,245,249,0.2)',
      'overlay-40': 'rgba(148, 163, 184,0.4)',
      'overlay-70': 'rgba(0,0,0,0.6)',
      'overlay-w-100': 'rgba(0,0,0,0.3)',
      'blue-chat': '#0084FF',
      'gray-chat': '#E4E6EB',
    },
    extend: {
      screens: {
        xl: '1440px',
        lg: '1024px',
        md: '768px',
        xs: '480px',
      },
      flex: {
        2: '2 1 0%',
        3: '3 1 0%',
      },
    },
    keyframes: {
      'slide-right': {
        '0%': {
          '-webkit-transform': ' translateX(-500px);',
          transform: 'translateX(-500px);',
        },
        '100%': {
          '-webkit-transform': 'translateX(0);',
          transform: 'translateX(0);',
        },
      },
      'slide-left': {
        '0%': {
          '-webkit-transform': ' translateX(500px);',
          transform: 'translateX(500px);',
        },
        '100%': {
          '-webkit-transform': 'translateX(0);',
          transform: 'translateX(0);',
        },
      },
    },
    animation: {
      'slide-right':
        'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      'slide-left':
        'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
    },
  },
  plugins: [],
};
