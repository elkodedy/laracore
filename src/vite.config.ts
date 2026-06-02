import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/',
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
      '@': path.resolve(__dirname, './resources/js'),
      '@components': path.resolve(__dirname, './resources/js/components'),
      '@layouts': path.resolve(__dirname, './resources/js/layouts'),
      '@hooks': path.resolve(__dirname, './resources/js/hooks'),
      '@services': path.resolve(__dirname, './resources/js/services'),
      '@types': path.resolve(__dirname, './resources/js/types'),
      '@utils': path.resolve(__dirname, './resources/js/utils'),
      '@constants': path.resolve(__dirname, './resources/js/constants'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    hmr: {
      host: 'laracore.test',
      protocol: 'ws',
      port: 5173,
    },

    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  ssr: {
    noExternal: ['@inertiajs/react'],
  },
});