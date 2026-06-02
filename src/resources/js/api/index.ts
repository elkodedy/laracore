/**
 * API SDK initialization and configuration
 *
 * This module initializes the generated API SDK from the OpenAPI specification.
 * All API calls should go through this client.
 */

import { queryClient } from './queryClient';
import { OpenAPI } from './generated';

// Configure the API client
export function initializeApiClient(baseUrl: string = '/api', token?: string) {
  OpenAPI.BASE = baseUrl;
  OpenAPI.HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    OpenAPI.TOKEN = token;
  }

  // Set up request interceptor for CSRF token if using Laravel
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  if (csrfTokenElement) {
    const csrfToken = csrfTokenElement.getAttribute('content');
    if (csrfToken) {
      OpenAPI.HEADERS['X-CSRF-TOKEN'] = csrfToken;
    }
  }
}

export { queryClient };
export * from './generated';
