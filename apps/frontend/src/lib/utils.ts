import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mobile-first breakpoint utilities
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Mobile-first responsive utilities
export const responsive = {
  mobile: "block md:hidden",
  desktop: "hidden md:block",
  tablet: "hidden md:block lg:hidden",
  largeScreen: "hidden lg:block",
} as const;

// Common mobile-first spacing and sizing
export const spacing = {
  container: "px-4 sm:px-6 lg:px-8",
  section: "py-8 sm:py-12 lg:py-16",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;
