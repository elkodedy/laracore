import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      '@components': path.resolve(__dirname, 'resources/js/components'),
      '@layouts': path.resolve(__dirname, 'resources/js/layouts'),
      '@hooks': path.resolve(__dirname, 'resources/js/hooks'),
      '@services': path.resolve(__dirname, 'resources/js/services'),
      '@types': path.resolve(__dirname, 'resources/js/types'),
      '@utils': path.resolve(__dirname, 'resources/js/utils'),
      '@constants': path.resolve(__dirname, 'resources/js/constants'),
    },
  },
  ssr: {
    noExternal: ['@inertiajs/react'],
  },
});
