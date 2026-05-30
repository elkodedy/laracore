import { useCallback } from 'react';
import http from '@services/http';

/**
 * Hook for handling API calls with loading and error states
 */
export function useApi<T = any>() {
  const request = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      url: string,
      data?: any,
    ): Promise<T> => {
      try {
        const response = await http[method]<T>(url, data);
        return response.data;
      } catch (error) {
        console.error(`API ${method.toUpperCase()} error:`, error);
        throw error;
      }
    },
    [],
  );

  return { request };
}
