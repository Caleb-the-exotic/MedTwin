import { Wifi } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { Badge, statusTone } from "@/components/ui/badge";

export function Topbar() {
  const { safetyScore, riskLevel } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-2.5 border-b border-hairline bg-panel/80 px-5 backdrop-blur-md">
      <div className="flex items-center gap-2 rounded-md border border-hairline bg-panel-raised/50 px-2.5 py-1.5">
        <Wifi className="h-3.5 w-3.5 text-safe" />
        <span className="font-mono text-[11px] text-ink-muted">
          Safety <span className="font-semibold text-ink tabular">{safetyScore}</span>
        </span>
        <span className="h-3 w-px bg-hairline-bright" />
        <Badge tone={statusTone(riskLevel)} dot>
          {riskLevel}
        </Badge>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-signal/25 bg-signal/10 font-mono text-[11px] font-semibold text-signal">
        CS
      </div>
    </header>
  );
}
