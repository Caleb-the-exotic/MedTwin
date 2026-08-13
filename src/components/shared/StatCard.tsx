import React from "react";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

type Tone = "signal" | "amber" | "critical" | "safe" | "violet";

const toneText: Record<Tone, string> = {
  signal: "text-signal",
  amber: "text-amber",
  critical: "text-critical",
  safe: "text-safe",
  violet: "text-violet",
};
const toneBg: Record<Tone, string> = {
  signal: "bg-signal/10 border-signal/25",
  amber: "bg-amber/10 border-amber/25",
  critical: "bg-critical/10 border-critical/25",
  safe: "bg-safe/10 border-safe/25",
  violet: "bg-violet/10 border-violet/25",
};
const toneRail: Record<Tone, string> = {
  signal: "from-signal/70",
  amber: "from-amber/70",
  critical: "from-critical/70",
  safe: "from-safe/70",
  violet: "from-violet/70",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  tone = "signal",
  footnote,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: string; positive: boolean };
  tone?: Tone;
  footnote?: string;
}) {
  return (
    <Card interactive className="group overflow-hidden p-4">
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b to-transparent opacity-70",
          toneRail[tone],
        )}
      />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={cn("font-mono text-[26px] font-semibold leading-none tabular", toneText[tone])}>
              {value}
            </span>
            {unit && <span className="text-xs text-ink-muted">{unit}</span>}
          </div>
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px]",
                trend.positive
                  ? "border-safe/25 bg-safe/10 text-safe"
                  : "border-critical/25 bg-critical/10 text-critical",
              )}
            >
              {trend.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span className="font-mono tabular">{trend.value}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105",
            toneBg[tone],
          )}
        >
          <Icon className={cn("h-4 w-4", toneText[tone])} />
        </div>
      </div>
      {footnote && (
        <p className="mt-3 border-t border-hairline/70 pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
          {footnote}
        </p>
      )}
    </Card>
  );
}
