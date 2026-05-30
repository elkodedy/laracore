import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import Layout from '@layouts/Layout';

// Import CSS
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'LaraCore';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
      string,
      any
    >;
    return pages[`./pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4f46e5',
    showSpinner: true,
  },
});
