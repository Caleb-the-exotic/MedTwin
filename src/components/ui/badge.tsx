import React from "react";
import { cn } from "@/utils/cn";

type Tone = "default" | "signal" | "amber" | "critical" | "safe" | "violet" | "muted";

const toneClasses: Record<Tone, string> = {
  default: "bg-panel-raised text-ink border-hairline-bright",
  signal: "bg-signal/10 text-signal border-signal/30",
  amber: "bg-amber/10 text-amber border-amber/30",
  critical: "bg-critical/10 text-critical border-critical/30",
  safe: "bg-safe/10 text-safe border-safe/30",
  violet: "bg-violet/10 text-violet border-violet/30",
  muted: "bg-transparent text-ink-faint border-hairline",
};

export function Badge({
  tone = "default",
  className,
  children,
  dot = false,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide font-mono",
        toneClasses[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-signal": tone === "signal",
        "bg-amber": tone === "amber",
        "bg-critical": tone === "critical",
        "bg-safe": tone === "safe",
        "bg-violet": tone === "violet",
        "bg-ink-faint": tone === "default" || tone === "muted",
      })} />}
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "ok":
    case "passed":
    case "safe":
    case "low":
    case "validated":
    case "completed":
      return "safe";
    case "warning":
    case "moderate":
    case "paused":
    case "queued":
      return "amber";
    case "critical":
    case "failed":
    case "error":
    case "high":
      return "critical";
    case "running":
    case "in-simulation":
      return "signal";
    default:
      return "muted";
  }
}
