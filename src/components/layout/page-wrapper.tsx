import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  /**
   * Maximum width of the content container
   * - "sm" = max-w-2xl (forms, compact pages)
   * - "md" = max-w-3xl (detail pages)
   * - "lg" = max-w-5xl (list pages)
   * - "xl" = max-w-6xl (landing pages)
   * - "full" = no max-width
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Additional classes for the main element */
  className?: string;
  /** Show background gradient orbs and grid pattern */
  showBackground?: boolean;
  /** Center content vertically (useful for login pages) */
  centered?: boolean;
}

export function PageWrapper({
  children,
  size = "lg",
  className,
  showBackground = true,
  centered = false,
}: PageWrapperProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "",
  };

  return (
    <main
      className={cn(
        "relative min-h-[calc(100vh-4rem)] bg-background overflow-x-hidden",
        centered && "flex items-center justify-center",
        className,
      )}
    >
      {showBackground && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]"
            style={{
              maskImage:
                "radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)",
            }}
          />
        </div>
      )}

      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          !centered && "py-8 sm:py-12",
          sizeClasses[size],
        )}
      >
        {children}
      </div>
    </main>
  );
}
