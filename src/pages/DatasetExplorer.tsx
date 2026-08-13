import React, { useMemo, useState } from "react";
import { Database, Search, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { VitalsLineChart } from "@/components/charts/VitalsChart";
import { initialDataset } from "@/data/mockData";
import { formatDateTime } from "@/utils/format";

export default function DatasetExplorer() {
  const [query, setQuery] = useState("");
  const [labelFilter, setLabelFilter] = useState("all");

  const labels = useMemo(() => ["all", ...Array.from(new Set(initialDataset.map((d) => d.label)))], []);

  const filtered = initialDataset.filter((d) => {
    const matchesQuery = d.id.toLowerCase().includes(query.toLowerCase()) || d.label.includes(query.toLowerCase());
    const matchesLabel = labelFilter === "all" || d.label === labelFilter;
    return matchesQuery && matchesLabel;
  });

  const anomalyCount = initialDataset.filter((d) => d.anomaly).length;
  const avgHr = Math.round(initialDataset.reduce((a, d) => a + d.hr, 0) / initialDataset.length);
  const avgSpo2 = Math.round((initialDataset.reduce((a, d) => a + d.spo2, 0) / initialDataset.length) * 10) / 10;

  const chartData = initialDataset.map((d, i) => ({
    t: i,
    hr: d.hr,
    spo2: d.spo2,
    systolic: d.systolic,
    diastolic: d.diastolic,
    respiration: d.respiration,
    temperature: d.temperature,
    glucose: 0,
  }));

  return (
    <AppLayout title="Dataset Explorer" subtitle="Simulated physiological dataset generated across all patient presets and failure scenarios">
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Database} label="Total Records" value={initialDataset.length} tone="signal" />
        <StatCard icon={AlertTriangle} label="Anomalies Labeled" value={anomalyCount} tone="amber" />
        <StatCard icon={Database} label="Avg. Heart Rate" value={avgHr} unit="bpm" tone="critical" />
        <StatCard icon={Database} label="Avg. SpO2" value={avgSpo2} unit="%" tone="safe" />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Heart Rate Distribution Across Dataset</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <VitalsLineChart data={chartData} dataKey="hr" domain={[50, 180]} height={180} />
        </CardContent>
      </Card>

      <SectionHeader
        title="Records"
        description={`${filtered.length} of ${initialDataset.length} records`}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
              <Input placeholder="Search records..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-52 pl-8" />
            </div>
            <Select value={labelFilter} onChange={setLabelFilter} className="w-40" options={labels.map((l) => ({ value: l, label: l === "all" ? "All Labels" : l }))} />
          </div>
        }
      />

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>ID</TH>
              <TH>Timestamp</TH>
              <TH>HR</TH>
              <TH>SpO2</TH>
              <TH>BP</TH>
              <TH>Resp.</TH>
              <TH>Temp</TH>
              <TH>Label</TH>
            </tr>
          </THead>
          <TBody>
            {filtered.slice(0, 30).map((d) => (
              <TR key={d.id}>
                <TD className="font-mono text-ink-muted">{d.id}</TD>
                <TD className="font-mono text-ink-faint">{formatDateTime(d.timestamp)}</TD>
                <TD className="font-mono tabular">{d.hr}</TD>
                <TD className="font-mono tabular">{d.spo2}%</TD>
                <TD className="font-mono tabular">{d.systolic}/{d.diastolic}</TD>
                <TD className="font-mono tabular">{d.respiration}</TD>
                <TD className="font-mono tabular">{d.temperature}°C</TD>
                <TD><Badge tone={d.anomaly ? "amber" : "safe"}>{d.label}</Badge></TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </AppLayout>
  );
}
