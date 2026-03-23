import type { ReactNode } from "react";

const baseClasses =
  "px-4 py-2 sm:px-3 sm:py-1 text-xs border-1 transition-all duration-200 min-h-[44px] sm:min-h-0 uppercase tracking-wide inline-flex items-center cursor-pointer";

const variantClasses = {
  primary:
    "bg-black text-white border-black hover:bg-gray-800 shadow-[1px_1px_0px_0px_rgb(75,85,99)]",
  secondary:
    "bg-white text-black border-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgb(0,0,0)]",
};

export function getButtonClasses(variant: "primary" | "secondary" = "primary", className = "") {
  return `${baseClasses} ${variantClasses[variant]} ${className}`;
}

type LinkButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
  className?: string;
};

type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
};

export type ButtonProps = LinkButtonProps | ActionButtonProps;

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return "href" in props;
}

export function Button(props: ButtonProps) {
  if (isLinkButton(props)) {
    const { children, href, variant = "primary", target, rel, className = "" } = props;
    return (
      <a href={href} target={target} rel={rel} className={getButtonClasses(variant, className)}>
        {children}
      </a>
    );
  }

  const { children, onClick, variant = "primary", disabled = false, className = "" } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses(variant, `disabled:opacity-50 ${className}`)}
    >
      {children}
    </button>
  );
}
