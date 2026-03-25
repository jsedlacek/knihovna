import type { ReactNode } from "react";
import { cn } from "./cn.ts";

export interface LinkProps {
  children: ReactNode;
  href: string;
  external?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  title?: string;
}

export function Link({
  children,
  href,
  external = true,
  target,
  rel,
  className,
  title,
}: LinkProps) {
  return (
    <a
      href={href}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      className={cn("text-link hover:underline", className)}
      title={title}
    >
      {children}
    </a>
  );
}
