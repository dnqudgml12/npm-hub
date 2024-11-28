import type { Config } from 'tailwindcss';
import colors from './styles/theme/colors';

const config: Config = {
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
