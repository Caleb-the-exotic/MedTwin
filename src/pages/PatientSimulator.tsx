import React from "react";
import { Activity, Wind, Droplets } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VitalsLineChart } from "@/components/charts/VitalsChart";
import { useAppStore, PRESETS } from "@/hooks/useAppStore";
import type { PatientPreset } from "@/types";

const PRESET_META: {
  key: PatientPreset;
  label: string;
  tone: "safe" | "critical" | "amber" | "signal" | "violet";
}[] = [
  { key: "normal", label: "Normal", tone: "safe" },
  { key: "tachycardia", label: "Tachycardia", tone: "critical" },
  { key: "hypoxia", label: "Hypoxia", tone: "violet" },
  { key: "hypotension", label: "Hypotension", tone: "amber" },
  { key: "fever", label: "Fever", tone: "critical" },
];

export default function PatientSimulator() {
  const {
    patients,
    selectedPatientId,
    selectPatient,
    preset,
    applyPreset,
    sliderOverrides,
    setSliderValue,
    vitalsHistory,
  } = useAppStore();
  const patient = patients.find((p) => p.id === selectedPatientId) ?? patients[0];
  const baseline = { ...patient.baseline, ...sliderOverrides };

  return (
    <>
      <SectionHeader
        title={patient.name}
        action={
          <Select
            value={selectedPatientId}
            onChange={selectPatient}
            options={patients.map((p) => ({ value: p.id, label: p.name }))}
            className="w-64"
          />
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESET_META.map((p) => (
          <Button
            key={p.key}
            variant={preset === p.key ? "primary" : "outline"}
            size="sm"
            onClick={() => applyPreset(p.key)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Physiological Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Slider
              label="Heart Rate"
              value={baseline.hr}
              min={30}
              max={220}
              unit=" bpm"
              onChange={(v) => setSliderValue("hr", v)}
              tone="signal"
              danger={(v) => v > 150 || v < 45}
            />
            <Slider
              label="SpO2"
              value={baseline.spo2}
              min={60}
              max={100}
              unit="%"
              onChange={(v) => setSliderValue("spo2", v)}
              tone="violet"
              danger={(v) => v < 90}
            />
            <Slider
              label="Systolic BP"
              value={baseline.systolic}
              min={50}
              max={220}
              unit=" mmHg"
              onChange={(v) => setSliderValue("systolic", v)}
              tone="amber"
              danger={(v) => v < 90 || v > 180}
            />
            <Slider
              label="Diastolic BP"
              value={baseline.diastolic}
              min={30}
              max={140}
              unit=" mmHg"
              onChange={(v) => setSliderValue("diastolic", v)}
              tone="amber"
              danger={(v) => v < 50 || v > 110}
            />
            <Slider
              label="Respiration"
              value={baseline.respiration}
              min={4}
              max={60}
              unit=" /min"
              onChange={(v) => setSliderValue("respiration", v)}
              tone="signal"
              danger={(v) => v > 28 || v < 8}
            />
            <Slider
              label="Temperature"
              value={baseline.temperature}
              min={33}
              max={41}
              step={0.1}
              unit="°C"
              onChange={(v) => setSliderValue("temperature", v)}
              tone="critical"
              danger={(v) => v > 38.5 || v < 35}
            />
            <Slider
              label="Glucose"
              value={baseline.glucose}
              min={40}
              max={300}
              unit=" mg/dL"
              onChange={(v) => setSliderValue("glucose", v)}
              tone="violet"
              danger={(v) => v < 70 || v > 180}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ECG / Heart Rate</CardTitle>
              <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                <Activity className="h-3.5 w-3.5 text-critical" /> {baseline.hr} bpm
              </span>
            </CardHeader>
            <CardContent className="pt-0">
              <VitalsLineChart data={vitalsHistory} dataKey="hr" domain={[30, 220]} height={170} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SpO2</CardTitle>
                <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                  <Droplets className="h-3.5 w-3.5 text-signal" /> {baseline.spo2}%
                </span>
              </CardHeader>
              <CardContent className="pt-0">
                <VitalsLineChart
                  data={vitalsHistory}
                  dataKey="spo2"
                  domain={[60, 100]}
                  height={150}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Respiration</CardTitle>
                <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                  <Wind className="h-3.5 w-3.5 text-amber" /> {baseline.respiration}/min
                </span>
              </CardHeader>
              <CardContent className="pt-0">
                <VitalsLineChart
                  data={vitalsHistory}
                  dataKey="respiration"
                  domain={[0, 60]}
                  height={150}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
