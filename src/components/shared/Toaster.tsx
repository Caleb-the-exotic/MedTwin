import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Radio, X } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/utils/cn";

const toneIcon: Record<string, React.ElementType> = {
  signal: Radio,
  amber: AlertTriangle,
  critical: XCircle,
  safe: CheckCircle2,
};

const toneClasses: Record<string, string> = {
  signal: "border-signal/30 text-signal",
  amber: "border-amber/30 text-amber",
  critical: "border-critical/30 text-critical",
  safe: "border-safe/30 text-safe",
};

export function Toaster() {
  const { toasts, dismissToast } = useAppStore();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = toneIcon[t.tone];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-panel/95 p-3 shadow-panel backdrop-blur animate-rise",
              toneClasses[t.tone]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[11px] text-ink-muted">{t.description}</p>}
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-ink-faint hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
