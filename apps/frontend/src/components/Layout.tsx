"use client";

import { cn, spacing } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto", spacing.container, sizeClasses[size], className)}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "transparent";
}

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-gray-50",
  transparent: "bg-transparent",
};

export function Section({
  children,
  className,
  background = "transparent",
}: SectionProps) {
  return (
    <section
      className={cn(spacing.section, backgroundClasses[background], className)}
    >
      {children}
    </section>
  );
}

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function Grid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = 6,
}: GridProps) {
  const gridCols = `grid-cols-${cols.default}`;
  const smCols = cols.sm ? `sm:grid-cols-${cols.sm}` : "";
  const mdCols = cols.md ? `md:grid-cols-${cols.md}` : "";
  const lgCols = cols.lg ? `lg:grid-cols-${cols.lg}` : "";
  const xlCols = cols.xl ? `xl:grid-cols-${cols.xl}` : "";
  const gapClass = `gap-${gap}`;

  return (
    <div
      className={cn(
        "grid",
        gridCols,
        smCols,
        mdCols,
        lgCols,
        xlCols,
        gapClass,
        className
      )}
    >
      {children}
    </div>
  );
}
