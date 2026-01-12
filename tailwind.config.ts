import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'linear-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'linear-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
        'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
        'linear-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'linear-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
        'linear-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
        'linear-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
