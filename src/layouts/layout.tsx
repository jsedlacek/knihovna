import React from "react";
import "#@/styles/global.css";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
