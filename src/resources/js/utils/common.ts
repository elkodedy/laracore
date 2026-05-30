/**
 * Common utility functions
 */

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString();
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString();
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
