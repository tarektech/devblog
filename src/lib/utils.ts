import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing whitespace
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function generateUniqueSlug(title: string, id?: string): string {
  const baseSlug = generateSlug(title);
  if (id) {
    return `${baseSlug}-${id.substring(0, 8)}`;
  }
  return baseSlug;
}
