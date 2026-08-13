import React from "react";
import { Link } from "@tanstack/react-router";
import { CircuitBoard, FlaskConical, ListChecks, ShieldAlert, Activity, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { BarComparison } from "@/components/charts/BarComparison";
import { TelemetryStrip } from "@/components/shared/TelemetryStrip";
import { useAppStore } from "@/hooks/useAppStore";
import { formatRelativeTime } from "@/utils/format";
import { initialTestResults } from "@/data/mockData";

const activityData = [
  { day: "Mon", runs: 8 },
  { day: "Tue", runs: 14 },
  { day: "Wed", runs: 10 },
  { day: "Thu", runs: 19 },
  { day: "Fri", runs: 15 },
  { day: "Sat", runs: 6 },
  { day: "Sun", runs: 11 },
];

export default function Dashboard() {
  const { devices, twins, simulationRuns, alerts, safetyScore, riskLevel } = useAppStore();

  const criticalRisks = twins.filter((t) => t.riskLevel === "high" || t.riskLevel === "critical").length;
  const testsCompleted = initialTestResults.length;

  return (
    <AppLayout title="Dashboard" subtitle="Fleet overview across all active digital twins and simulations">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CircuitBoard} label="Active Devices" value={devices.length} trend={{ value: "+1 this month", positive: true }} tone="signal" />
        <StatCard icon={FlaskConical} label="Running Simulations" value={simulationRuns.filter((r) => r.status === "running").length} unit={`/ ${simulationRuns.length}`} tone="violet" />
        <StatCard icon={ListChecks} label="Tests Completed" value={testsCompleted} trend={{ value: "+3 today", positive: true }} tone="safe" />
        <StatCard icon={ShieldAlert} label="Critical Risks" value={criticalRisks} tone={criticalRisks > 0 ? "critical" : "safe"} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col p-4 lg:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Fleet Safety Score
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-mono text-4xl font-semibold leading-none text-signal tabular text-glow">
              {safetyScore}
            </span>
            <span className="mb-0.5 text-sm text-ink-muted">/ 100</span>
          </div>
          <Progress
            value={safetyScore}
            tone={safetyScore > 84 ? "safe" : safetyScore > 64 ? "amber" : "critical"}
            className="mt-3"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Aggregate risk level</span>
            <Badge tone={statusTone(riskLevel)} dot>
              {riskLevel}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-hairline/70 pt-3">
            {[
              { label: "Twins synced", value: `${twins.length}` },
              { label: "Avg fidelity", value: `${Math.round(twins.reduce((s, t) => s + t.fidelity, 0) / Math.max(1, twins.length))}%` },
              { label: "Open anomalies", value: `${simulationRuns.reduce((s, r) => s + r.anomalies, 0)}` },
              { label: "Unread alerts", value: `${alerts.filter((a) => !a.read).length}` },
            ].map((m) => (
              <div key={m.label} className="rounded-md border border-hairline bg-panel-raised/40 px-2.5 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                  {m.label}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-ink tabular">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
              Live telemetry
            </p>
            <TelemetryStrip seed={3} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Simulation Activity — Last 7 Days</CardTitle>
            <Link to="/simulation-lab" className="flex items-center gap-1 text-xs text-signal hover:underline">
              Open Simulation Lab <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <BarComparison data={activityData} dataKey="runs" xKey="day" color="#4FD1C5" height={200} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Digital Twins</CardTitle>
            <Link to="/digital-twin" className="flex items-center gap-1 text-xs text-signal hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col divide-y divide-hairline">
              {twins.map((twin) => (
                <div key={twin.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-panel-raised">
                      <Activity className={`h-4 w-4 ${twin.status === "running" ? "text-signal animate-blink" : "text-ink-faint"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{twin.deviceName}</p>
                      <p className="font-mono text-[11px] text-ink-faint">Fidelity {twin.fidelity}% · Synced {formatRelativeTime(twin.lastSync)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={statusTone(twin.riskLevel)}>{twin.riskLevel}</Badge>
                    <Badge tone={statusTone(twin.status)}>{twin.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col divide-y divide-hairline">
              {alerts.slice(0, 5).map((a) => (
                <div key={a.id} className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(a.severity)} dot>{a.severity}</Badge>
                    <span className="truncate text-xs font-medium text-ink">{a.title}</span>
                  </div>
                  <p className="mt-1 pl-0.5 text-[11px] text-ink-muted line-clamp-1">{a.message}</p>
                  <p className="mt-0.5 pl-0.5 font-mono text-[10px] text-ink-faint">{formatRelativeTime(a.time)} · {a.source}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <SectionHeader title="Recent Simulations" description="Latest runs across all devices" />
        <Card>
          <Table>
            <THead>
              <tr>
                <TH>Run</TH>
                <TH>Device</TH>
                <TH>Status</TH>
                <TH>Progress</TH>
                <TH>Safety Score</TH>
                <TH>Anomalies</TH>
                <TH>Started</TH>
              </tr>
            </THead>
            <TBody>
              {simulationRuns.map((run) => (
                <TR key={run.id}>
                  <TD className="font-medium">{run.name}</TD>
                  <TD className="text-ink-muted">{run.deviceName}</TD>
                  <TD><Badge tone={statusTone(run.status)}>{run.status}</Badge></TD>
                  <TD className="w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={run.progress} className="w-16" />
                      <span className="font-mono text-[11px] text-ink-muted">{run.progress}%</span>
                    </div>
                  </TD>
                  <TD className="font-mono tabular">{run.safetyScore || "—"}</TD>
                  <TD className="font-mono tabular">{run.anomalies}</TD>
                  <TD className="font-mono text-ink-faint">{formatRelativeTime(run.startedAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
