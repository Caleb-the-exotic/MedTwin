import React from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-signal text-void font-semibold shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-signal)_35%,transparent),0_6px_18px_-8px_color-mix(in_oklab,var(--color-signal)_60%,transparent)] hover:bg-signal/90 active:translate-y-px",
  secondary:
    "bg-panel-raised text-ink border border-hairline-bright hover:bg-panel-hover hover:border-signal/30 active:translate-y-px",
  ghost: "text-ink-muted hover:text-ink hover:bg-panel-raised",
  outline:
    "border border-hairline text-ink-muted hover:border-signal/50 hover:text-signal hover:bg-signal/5",
  danger:
    "bg-critical/15 text-critical border border-critical/30 hover:bg-critical/25 hover:border-critical/50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-sm gap-2 rounded-md",
  lg: "h-11 px-5 text-sm gap-2 rounded-lg",
  icon: "h-9 w-9 p-0 justify-center rounded-md",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center whitespace-nowrap transition-all duration-150 outline-none disabled:pointer-events-none disabled:opacity-40",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
