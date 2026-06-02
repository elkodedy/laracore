/**
 * React Query configuration and initialization
 */

import {
  QueryClient,
  QueryClientConfig,
} from '@tanstack/react-query';

// Default query options
const defaultQueryOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount) => {
        // Don't retry on 4xx errors, retry on 5xx or network errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

export const queryClient = new QueryClient(defaultQueryOptions);
