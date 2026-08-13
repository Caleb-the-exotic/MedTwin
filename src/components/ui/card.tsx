import React from "react";
import { cn } from "@/utils/cn";

export function Card({
  className,
  children,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-hairline bg-panel/90 shadow-panel backdrop-blur-[2px] transition-all duration-200",
        "before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-signal/25 before:to-transparent",
        interactive && "hover:-translate-y-px hover:border-hairline-bright hover:shadow-panel-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-hairline/70 px-4 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-hairline/70 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
