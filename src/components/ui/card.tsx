import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`bg-card p-3 sm:p-4 border border-border ${className}`}>{children}</div>;
}
