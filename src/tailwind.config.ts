import type { Config } from 'tailwindcss';

export default {
  content: [
    './resources/views/**/*.{blade.php,jsx,tsx}',
    './resources/js/**/*.{jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
