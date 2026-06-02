import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './public/openapi.json',
  output: {
    path: './resources/js/api/generated',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    {
      name: '@hey-api/transformers',
      asClass: true,
    },
  ],
  services: {
    asClass: true,
  },
  types: {
    dates: true,
  },
});
