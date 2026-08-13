import React from "react";
import { cn } from "@/utils/cn";

export function Progress({
  value,
  className,
  barClassName,
  tone = "signal",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: "signal" | "amber" | "critical" | "safe" | "violet";
}) {
  const toneBg: Record<string, string> = {
    signal: "bg-signal",
    amber: "bg-amber",
    critical: "bg-critical",
    safe: "bg-safe",
    violet: "bg-violet",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-hairline", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneBg[tone], barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
