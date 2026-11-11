/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1A2FBF',
          dark: '#0B1470',
          light: '#CFD6FF',
        },
        accent: {
          DEFAULT: '#FDB94E',
          hover: '#F59E0B',
        },
        lime: {
          DEFAULT: '#8CF25A',
        },
        arcade: {
          bg: '#0A0E1A',
          cyan: '#22D3EE',
        },
        surface: {
          light: '#FFFFFF',
          warm: '#E8E6E1',
          ink: '#0B1B3A',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"Rajdhani"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        neo: '4px 4px 0px #0B1B3A',
        'neo-lg': '6px 6px 0px #0B1B3A',
        'neo-sm': '2px 2px 0px #0B1B3A',
        'neo-yellow': '4px 4px 0px #FDB94E',
        'neo-cyan': '4px 4px 0px #22D3EE',
      },
    },
  },
  plugins: [],
};
