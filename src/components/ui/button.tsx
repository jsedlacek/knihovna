import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
  className?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  target = "_blank",
  rel = "noopener noreferrer",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 sm:px-3 sm:py-1 text-xs font-mono border-1 transition-all duration-200 min-h-[44px] sm:min-h-0 uppercase tracking-wide inline-flex items-center";

  const variantClasses = {
    primary:
      "bg-gray-200 text-gray-900 border-gray-400 hover:bg-gray-300 hover:border-gray-500 shadow-[1px_1px_0px_0px_rgb(107,114,128)]",
    secondary:
      "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:border-gray-400 shadow-[1px_1px_0px_0px_rgb(156,163,175)]",
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
