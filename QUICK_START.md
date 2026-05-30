# LaraCore - Quick Start Guide

## 🚀 Getting Started

### Start the Development Environment
```bash
cd /Code/laracore
docker compose up -d
```

### Run Development Servers
```bash
# In one terminal: Laravel + PHP
docker compose exec php php artisan serve

# In another terminal: Vite (hot reload)
docker compose exec node npm run dev
```

Or use the combined command:
```bash
docker compose exec php php artisan dev
```

### Build for Production
```bash
docker compose exec node npm run build
```

## 📂 Creating New Pages

### 1. Create React Component
Create `resources/js/pages/About.tsx`:
```typescript
import React from 'react';
import { Head } from '@inertiajs/react';

export default function About() {
  return (
    <>
      <Head title="About" />
      <div className="p-8">
        <h1 className="text-3xl font-bold">About Us</h1>
      </div>
    </>
  );
}
```

### 2. Create Route
In `routes/web.php`:
```php
use Inertia\Inertia;

Route::get('/about', function () {
    return Inertia::render('About');
});
```

## 🧩 Creating Reusable Components

### Example Button Component
Create `resources/js/components/common/Button.tsx`:
```typescript
import React from 'react';
import { classNames } from '@utils/common';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  onClick,
  className,
  children,
  variant = 'primary',
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  };

  return (
    <button
      onClick={onClick}
      className={classNames(baseClasses, variants[variant], className)}
    >
      {children}
    </button>
  );
}
```

### Use in Pages
```typescript
import Button from '@components/common/Button';

export default function MyPage() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}
```

## 🔌 Creating Custom Hooks

### Example: useLocalStorage
Create `resources/js/hooks/useLocalStorage.ts`:
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 🌐 Making API Calls

### Using the HTTP Service
```typescript
import http from '@services/http';
import { ApiResponse, User } from '@types';

// In component or hook
const getUsers = async () => {
  try {
    const response = await http.get<ApiResponse<User[]>>('/api/users');
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};
```

### Using useApi Hook
```typescript
import { useApi } from '@hooks/useApi';

export default function UsersList() {
  const { request } = useApi();

  React.useEffect(() => {
    request('get', '/api/users').then(data => {
      console.log(data);
    });
  }, []);

  return <div>Users...</div>;
}
```

## 🎨 Tailwind CSS Tips

### Commonly Used Classes
```typescript
// Spacing
className="p-4 m-2 mb-4"

// Colors
className="text-indigo-600 bg-gray-100 border border-gray-300"

// Responsive
className="w-full md:w-1/2 lg:w-1/3"

// Flexbox
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Animations
className="transition hover:bg-gray-200 duration-300"
```

## 📦 Environment Variables

### Frontend Variables
In `.env`:
```
VITE_APP_NAME=LaraCore
VITE_APP_URL=http://localhost
```

Access in components:
```typescript
import { APP_NAME } from '@constants';
// or
const appName = import.meta.env.VITE_APP_NAME;
```

## 🛠️ Debugging Tips

### Chrome DevTools
- React DevTools extension recommended
- Check Network tab for API calls
- Console for JavaScript errors

### Laravel Telescope (Optional)
Monitor requests, database queries, and cache:
```bash
composer require laravel/telescope
php artisan telescope:install
```

### Vite Debug
Enable source maps in vite.config.ts:
```typescript
export default defineConfig({
  // ...
  build: {
    sourcemap: true,
  },
});
```

## 📚 File Organization Best Practices

```
resources/js/
├── components/
│   ├── common/        # Reusable across pages
│   │   └── Button.tsx
│   └── ui/            # UI-specific
│       └── Header.tsx
├── layouts/
│   └── Layout.tsx     # Wrap all pages
├── pages/
│   ├── Home.tsx
│   └── About.tsx
├── hooks/             # Custom React hooks
├── services/          # API & business logic
├── types/             # TypeScript definitions
├── utils/             # Helper functions
├── constants/         # App-wide constants
└── app.tsx           # Entry point
```

## 🚀 Performance Tips

1. **Code Splitting**: Lazy load components for large apps
2. **Memoization**: Use React.memo for expensive components
3. **Image Optimization**: Use responsive images with Tailwind
4. **Bundle Analysis**: Check build sizes regularly

## 🤝 Contributing

- Keep components small and focused
- Write TypeScript types for everything
- Use path aliases (`@/...`) for imports
- Follow Tailwind CSS utility patterns
- Add JSDoc comments to hooks and services

## 📖 Documentation

- [Inertia.js Documentation](https://inertiajs.com/)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy coding!** 🎉
