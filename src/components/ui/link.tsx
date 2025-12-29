import type { ReactNode } from "react";

export interface LinkProps {
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
}

export function Link({
  children,
  href,
  target = "_blank",
  rel = "noopener noreferrer",
  className = "",
}: LinkProps) {
  return (
    <a href={href} target={target} rel={rel} className={`hover:underline ${className}`}>
      {children}
    </a>
  );
}
