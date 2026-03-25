import type { ReactNode } from "react";
import { cn } from "./cn.ts";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("bg-card p-3 sm:p-4 border border-border", className)}>{children}</div>;
}
