import React from "react";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  size?: "default" | "narrow" | "reading" | "fluid";
}

/**
 * PABLO Unified Layout Primitive: PageContainer
 * Enforces standardized responsive gutters and max-width across all departments.
 * - Mobile (< 640px): 1.5rem (24px)
 * - Tablet (640px - 1024px): 3rem (48px)
 * - Desktop (>= 1024px): 5rem (80px)
 */
export function PageContainer({
  children,
  as: Component = "div",
  className = "",
  size = "default",
  ...props
}: PageContainerProps) {
  const containerClass =
    size === "narrow"
      ? "page-container-narrow"
      : size === "reading"
      ? "page-container-reading"
      : size === "fluid"
      ? "page-container-fluid"
      : "page-container";

  return (
    <Component className={`${containerClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default PageContainer;
