import type { ReactNode } from "react";
import { cn } from "./cn.ts";

export interface LinkProps {
  children: ReactNode;
  href: string;
  external?: boolean;
  className?: string;
  title?: string;
}

export function Link({ children, href, external = true, className, title }: LinkProps) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn("text-link hover:underline", className)}
      title={title}
    >
      {children}
    </a>
  );
}
