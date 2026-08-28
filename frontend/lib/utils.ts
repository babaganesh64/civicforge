import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  if (!date) return '';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = new Date(date).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return rtf.format(diffDays, 'day');
}
