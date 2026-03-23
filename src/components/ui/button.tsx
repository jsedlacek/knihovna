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
  target,
  rel,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 sm:px-3 sm:py-1 text-xs border-1 transition-all duration-200 min-h-[44px] sm:min-h-0 uppercase tracking-wide inline-flex items-center";

  const variantClasses = {
    primary:
      "bg-black text-white border-black hover:bg-gray-800 shadow-[1px_1px_0px_0px_rgb(0,0,0)]",
    secondary:
      "bg-white text-black border-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgb(107,114,128)]",
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
