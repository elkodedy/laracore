/**
 * HTTP Service - Reusable API client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: window.location.origin,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    // Add CSRF token from meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      this.client.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }

  async get<T>(url: string) {
    return this.client.get<T>(url);
  }

  async post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  async put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  async patch<T>(url: string, data?: any) {
    return this.client.patch<T>(url, data);
  }

  async delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export default new HttpService();
