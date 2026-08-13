import React from "react";
import { Play, Pause, Square, RotateCcw, Activity, Cpu, Zap, HeartPulse } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { VitalsLineChart } from "@/components/charts/VitalsChart";
import { useAppStore } from "@/hooks/useAppStore";

export default function SimulationLab() {
  const { simClock, simStart, simPause, simStop, simRestart, vitalsHistory, timeline, failures } = useAppStore();
  const activeFailures = failures.filter((f) => f.active);

  const controllerResponse = vitalsHistory.map((v) => ({
    ...v,
    hr: Math.round(v.hr + (activeFailures.find((f) => f.type === "controller-delay") ? Math.sin(v.t) * 6 : 0)),
  }));

  return (
    <AppLayout title="Simulation Lab" subtitle="Live signal path from physiological input through actuator output">
      <SectionHeader
        title="Simulation Controls"
        description={`Elapsed ${formatElapsed(simClock.elapsed)} · ${activeFailures.length} active failure${activeFailures.length === 1 ? "" : "s"}`}
        action={
          <div className="flex items-center gap-2">
            <Button variant={simClock.status === "running" ? "secondary" : "primary"} size="md" onClick={simStart} disabled={simClock.status === "running"}>
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
            <Button variant="secondary" size="md" onClick={simPause} disabled={simClock.status !== "running"}>
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
            <Button variant="secondary" size="md" onClick={simStop}>
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
            <Button variant="outline" size="md" onClick={simRestart}>
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
            <Badge tone={simClock.status === "running" ? "signal" : simClock.status === "paused" ? "amber" : "muted"} dot>
              {simClock.status}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Physiological Input</CardTitle>
            <HeartPulse className="h-3.5 w-3.5 text-critical" />
          </CardHeader>
          <CardContent className="pt-0">
            <VitalsLineChart data={vitalsHistory} dataKey="hr" domain={[30, 220]} height={160} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sensor Output</CardTitle>
            <Activity className="h-3.5 w-3.5 text-signal" />
          </CardHeader>
          <CardContent className="pt-0">
            <VitalsLineChart data={vitalsHistory} dataKey="spo2" domain={[60, 100]} height={160} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controller Response</CardTitle>
            <Cpu className="h-3.5 w-3.5 text-violet" />
          </CardHeader>
          <CardContent className="pt-0">
            <VitalsLineChart data={controllerResponse} dataKey="hr" domain={[30, 220]} height={160} strokeWidth={1.5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actuator Output</CardTitle>
            <Zap className="h-3.5 w-3.5 text-amber" />
          </CardHeader>
          <CardContent className="pt-0">
            <VitalsLineChart data={vitalsHistory} dataKey="respiration" domain={[0, 60]} height={160} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              <div className="relative flex flex-col gap-0 pl-4">
                <div className="absolute bottom-2 left-[5px] top-2 w-px bg-hairline" />
                {timeline.map((evt) => (
                  <div key={evt.id} className="relative flex items-start gap-3 py-2">
                    <span
                      className={`absolute -left-4 mt-1 h-2.5 w-2.5 rounded-full ring-4 ring-panel ${
                        evt.severity === "critical" ? "bg-critical" : evt.severity === "warning" ? "bg-amber" : "bg-safe"
                      }`}
                    />
                    <span className="w-14 shrink-0 font-mono text-[11px] text-ink-faint">t+{evt.t}s</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-ink">{evt.label}</p>
                      <p className="font-mono text-[10px] text-ink-faint">{evt.source}</p>
                    </div>
                    <Badge tone={statusTone(evt.severity)} className="shrink-0">{evt.severity}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
