import React from 'react';
import { createSSRApp } from '@inertiajs/react';
import Layout from '@layouts/Layout';

import '../css/app.css';

const el = document.getElementById('app');

const app = createSSRApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
      string,
      any
    >;
    return pages[`./pages/${name}.tsx`];
  },
  setup({ App, props }) {
    return <App {...props} />;
  },
});

export default app;
