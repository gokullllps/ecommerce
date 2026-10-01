import React from "react";
import MenPageShell from "@/components/men/MenPageShell";

export default function MenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MenPageShell>{children}</MenPageShell>;
}
