/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LaraCore';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const PAGINATION = {
  PER_PAGE: 15,
  MAX_PER_PAGE: 100,
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};
