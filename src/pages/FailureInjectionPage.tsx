import React from "react";
import { Zap, RotateCcw, ShieldAlert } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/hooks/useAppStore";

export default function FailureInjectionPage() {
  const { failures, toggleFailure, setFailureIntensity, resetFailures, safetyScore, riskLevel, anomalyScore } = useAppStore();
  const activeCount = failures.filter((f) => f.active).length;

  return (
    <AppLayout title="Failure Injection" subtitle="Inject controlled faults into device components and observe downstream safety impact">
      <SectionHeader
        title="Fault Injection Console"
        description={`${activeCount} of ${failures.length} failure modes active`}
        action={
          <Button variant="outline" onClick={resetFailures}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset All
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Safety Score</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular text-signal">{safetyScore}</p>
          <Progress value={safetyScore} tone={safetyScore > 84 ? "safe" : safetyScore > 64 ? "amber" : "critical"} className="mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Risk Level</p>
          <div className="mt-2"><Badge tone={statusTone(riskLevel)} className="text-xs">{riskLevel}</Badge></div>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Anomaly Score</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular text-amber">{anomalyScore}</p>
          <Progress value={anomalyScore} tone="amber" className="mt-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {failures.map((f) => (
          <Card key={f.id} className={`p-4 transition-colors ${f.active ? "border-amber/40" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${f.active ? "border-amber/40 bg-amber/10" : "border-hairline bg-panel-raised"}`}>
                  <Zap className={`h-4 w-4 ${f.active ? "text-amber" : "text-ink-faint"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{f.label}</p>
                  <p className="text-[11px] text-ink-faint">{f.targetComponent}</p>
                </div>
              </div>
              <Toggle checked={f.active} onChange={() => toggleFailure(f.id)} />
            </div>
            <p className="mt-2.5 text-xs text-ink-muted">{f.description}</p>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] text-ink-muted">Intensity</span>
                <span className="font-mono text-[11px] font-semibold text-ink">{f.intensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={f.intensity}
                disabled={!f.active}
                onChange={(e) => setFailureIntensity(f.id, Number(e.target.value))}
                className="slider-input w-full disabled:opacity-30"
                style={{ background: `linear-gradient(to right, #F5A623 ${f.intensity}%, #212B37 ${f.intensity}%)` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {activeCount > 2 && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-critical/30 bg-critical/5 p-3 text-sm text-critical">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Multiple concurrent failures active — this compound scenario significantly increases cumulative risk. Review AI Safety Analysis for details.</p>
        </div>
      )}
    </AppLayout>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${checked ? "border-amber/40 bg-amber/30" : "border-hairline bg-panel-raised"}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ink transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}
