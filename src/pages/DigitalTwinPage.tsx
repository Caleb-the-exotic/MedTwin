import React, { useMemo } from "react";
import { User, Radio, Cpu, Zap as ZapIcon, ArrowRight, HeartPulse, Wind, Thermometer, Battery, Gauge, Droplets } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/hooks/useAppStore";
import { formatRelativeTime } from "@/utils/format";

const STAGES = [
  { key: "patient", label: "Virtual Patient", icon: User },
  { key: "sensors", label: "Sensors", icon: Radio },
  { key: "processing", label: "Processing", icon: Cpu },
  { key: "controller", label: "Controller", icon: Cpu },
  { key: "actuator", label: "Actuator", icon: ZapIcon },
];

export default function DigitalTwinPage() {
  const { twins, currentVitals, failures } = useAppStore();
  const [selectedTwinId, setSelectedTwinId] = React.useState(twins[0].id);
  const twin = useMemo(() => twins.find((t) => t.id === selectedTwinId) ?? twins[0], [twins, selectedTwinId]);
  const [vitals, setVitals] = React.useState(currentVitals());

  React.useEffect(() => {
    const id = setInterval(() => setVitals(currentVitals()), 1200);
    return () => clearInterval(id);
  }, [currentVitals]);

  const activeFailures = failures.filter((f) => f.active);
  const battery = Math.max(8, 100 - activeFailures.filter((f) => f.type === "battery-degradation").reduce((a, f) => a + f.intensity * 0.5, 0));

  return (
    <AppLayout title="Digital Twin" subtitle="Real-time synchronized model of the device operating on a virtual patient">
      <SectionHeader
        title="System Overview"
        description={`Twin fidelity ${twin.fidelity}% · last sync ${formatRelativeTime(twin.lastSync)}`}
        action={
          <Select
            value={selectedTwinId}
            onChange={setSelectedTwinId}
            options={twins.map((t) => ({ value: t.id, label: t.deviceName }))}
            className="w-56"
          />
        }
      />

      <Card className="mb-4 overflow-x-auto p-6">
        <div className="flex min-w-[720px] items-center justify-between">
          {STAGES.map((stage, i) => (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border ${
                    twin.status === "running" ? "border-signal/40 bg-signal/10 shadow-glow" : "border-hairline bg-panel-raised"
                  }`}
                >
                  <stage.icon className={`h-6 w-6 ${twin.status === "running" ? "text-signal" : "text-ink-faint"}`} />
                </div>
                <span className="text-center text-[11px] font-medium text-ink-muted">{stage.label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight className={`mx-2 h-4 w-4 shrink-0 ${twin.status === "running" ? "text-signal/60 animate-pulse" : "text-ink-faint"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <LiveParam icon={HeartPulse} label="Heart Rate" value={vitals.hr} unit="bpm" tone="critical" />
        <LiveParam icon={Droplets} label="SpO2" value={vitals.spo2} unit="%" tone="signal" />
        <LiveParam icon={Gauge} label="Systolic" value={vitals.systolic} unit="mmHg" tone="violet" />
        <LiveParam icon={Gauge} label="Diastolic" value={vitals.diastolic} unit="mmHg" tone="violet" />
        <LiveParam icon={Wind} label="Flow" value={Math.round(180 + vitals.hr * 0.4)} unit="mL/h" tone="signal" />
        <LiveParam icon={Thermometer} label="Temp" value={vitals.temperature} unit="°C" tone="safe" />
        <LiveParam icon={Battery} label="Battery" value={Math.round(battery)} unit="%" tone={battery < 25 ? "critical" : "safe"} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Twin Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricBlock label="Status" value={<Badge tone={statusTone(twin.status)}>{twin.status}</Badge>} />
            <MetricBlock label="Risk Level" value={<Badge tone={statusTone(twin.riskLevel)}>{twin.riskLevel}</Badge>} />
            <MetricBlock label="Safety Score" value={<span className="font-mono text-lg font-semibold text-signal tabular">{twin.safetyScore}</span>} />
            <MetricBlock label="Uptime" value={<span className="font-mono text-lg font-semibold text-ink tabular">{Math.floor(twin.uptimeSec / 60)}m</span>} />
            <div className="col-span-2 sm:col-span-4">
              <p className="mb-1.5 text-[11px] text-ink-muted">Model fidelity vs. physical reference</p>
              <Progress value={twin.fidelity} tone="signal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Failure Effects</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {activeFailures.length === 0 ? (
              <p className="text-xs text-ink-muted">No failures currently injected. Twin is operating at nominal fidelity.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {activeFailures.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-md border border-hairline bg-panel-raised px-2.5 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-ink">{f.label}</p>
                      <p className="truncate text-[10px] text-ink-faint">{f.targetComponent}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-amber">{f.intensity}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function LiveParam({ icon: Icon, label, value, unit, tone }: { icon: React.ElementType; label: string; value: number; unit: string; tone: "signal" | "critical" | "violet" | "safe" }) {
  const toneText: Record<string, string> = { signal: "text-signal", critical: "text-critical", violet: "text-violet", safe: "text-safe" };
  return (
    <Card className="p-3">
      <Icon className={`h-3.5 w-3.5 ${toneText[tone]}`} />
      <p className="mt-1.5 font-mono text-lg font-semibold tabular text-ink">{value}<span className="ml-0.5 text-[10px] font-normal text-ink-faint">{unit}</span></p>
      <p className="text-[10px] text-ink-faint">{label}</p>
    </Card>
  );
}

function MetricBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
      {value}
    </div>
  );
}
