import React from "react";
import { Layout } from "#@/layouts/layout.tsx";

export default function LayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
