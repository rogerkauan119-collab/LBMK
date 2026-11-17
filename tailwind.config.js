/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#172EB9',
          dark: '#0E1D7A',
          light: '#CFD6FF',
        },
        accent: {
          DEFAULT: '#FDBA5A',
          hover: '#F59E0B',
        },
        lime: {
          DEFAULT: '#CEFFAD',
        },
        arcade: {
          bg: '#0A0E1A',
          cyan: '#22D3EE',
        },
        surface: {
          light: '#FFFFFF',
          warm: '#E8E7E3',
          ink: '#3A3A3A',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', '"Chakra Petch"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"Rajdhani"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        neo: '4px 4px 0px #3A3A3A',
        'neo-lg': '6px 6px 0px #3A3A3A',
        'neo-sm': '2px 2px 0px #3A3A3A',
        'neo-yellow': '4px 4px 0px #FDBA5A',
        'neo-cyan': '4px 4px 0px #22D3EE',
      },
    },
  },
  plugins: [],
};
