import { useMemo, useState } from "react";
import { CircuitBoard, HeartPulse, FlaskConical } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModelViewer } from "@/components/twin/ModelViewer";
import DeviceDesigner from "@/pages/DeviceDesigner";
import PatientSimulator from "@/pages/PatientSimulator";
import SimulationLab from "@/pages/SimulationLab";
import { useAppStore } from "@/hooks/useAppStore";

const MODEL_OPTIONS = [
  { id: "hand", label: "Hand", url: "/models/Hand.obj", patientId: "pt-01" },
  { id: "man", label: "Man", url: "/models/Man.obj", patientId: "pt-01" },
  { id: "woman", label: "Woman", url: "/models/Woman.obj", patientId: "pt-02" },
  { id: "child", label: "Child", url: "/models/baby.obj", patientId: "pt-03" },
];

const ZONE_LEGEND = [
  { zone: "top", label: "SpO2" },
  { zone: "upper", label: "Temp" },
  { zone: "center", label: "Heart Rate" },
  { zone: "lower", label: "Respiration" },
];

const DEFAULT_TEAL = "#4FD1C5";
const WARN_AMBER = "#F5A623";
const CRIT_RED = "#F0555A";

function lerpHex(from: string, to: string, t: number): string {
  const f = parseInt(from.slice(1), 16);
  const g = parseInt(to.slice(1), 16);
  const r = Math.round(((f >> 16) & 255) + (((g >> 16) & 255) - ((f >> 16) & 255)) * t);
  const gr = Math.round(((f >> 8) & 255) + (((g >> 8) & 255) - ((f >> 8) & 255)) * t);
  const b = Math.round((f & 255) + ((g & 255) - (f & 255)) * t);
  return `#${((r << 16) | (gr << 8) | b).toString(16).padStart(6, "0")}`;
}

function distOutside(value: number, lo: number, hi: number): number {
  if (value < lo) return lo - value;
  if (value > hi) return value - hi;
  return 0;
}

function zoneColor(
  value: number,
  optimal: [number, number],
  warn: [number, number],
  crit: [number, number],
): string {
  const d = distOutside(value, optimal[0], optimal[1]);
  if (d === 0) return DEFAULT_TEAL;
  const below = value < optimal[0];
  if (value < warn[0] || value > warn[1]) {
    const wEdge = below ? warn[0] : warn[1];
    const cEdge = below ? crit[0] : crit[1];
    const t = Math.min(1, d / Math.max(1e-6, Math.abs(wEdge - cEdge)));
    return lerpHex(WARN_AMBER, CRIT_RED, t);
  }
  const oEdge = below ? optimal[0] : optimal[1];
  const wEdge = below ? warn[0] : warn[1];
  const t = Math.min(1, d / Math.max(1e-6, Math.abs(wEdge - oEdge)));
  return lerpHex(DEFAULT_TEAL, WARN_AMBER, t);
}

export default function Dashboard() {
  const { patients, selectedPatientId, sliderOverrides, selectPatient } = useAppStore();
  const [modelUrl, setModelUrl] = useState("/models/Hand.obj");

  const handleModelChange = (url: string) => {
    setModelUrl(url);
    const match = MODEL_OPTIONS.find((m) => m.url === url);
    if (match) selectPatient(match.patientId);
  };

  const patient = patients.find((p) => p.id === selectedPatientId) ?? patients[0];
  const baseline = useMemo(
    () => ({ ...patient.baseline, ...sliderOverrides }),
    [patient, sliderOverrides],
  );

  const highlights = useMemo(
    () => ({
      top: zoneColor(baseline.spo2, [95, 100], [90, 100], [85, 100]),
      upper: zoneColor(baseline.temperature, [36.5, 37.5], [35, 38.5], [34.5, 39.5]),
      center: zoneColor(baseline.hr, [60, 100], [45, 150], [35, 180]),
      lower: zoneColor(baseline.respiration, [12, 20], [8, 28], [6, 32]),
    }),
    [baseline],
  );

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="min-w-0 xl:sticky xl:top-[76px] xl:self-start">
          <Tabs defaultValue="patient-simulator">
            <TabsList className="mb-4 flex w-full">
              <TabsTrigger value="patient-simulator" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5" /> Patient Simulator
                </span>
              </TabsTrigger>
              <TabsTrigger value="device-designer" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <CircuitBoard className="h-3.5 w-3.5" /> Device Designer
                </span>
              </TabsTrigger>
              <TabsTrigger value="simulation-lab" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5" /> Simulation Lab
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient-simulator">
              <PatientSimulator />
            </TabsContent>
            <TabsContent value="device-designer">
              <DeviceDesigner />
            </TabsContent>
            <TabsContent value="simulation-lab">
              <SimulationLab />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <SectionHeader
            title="Digital Twin Model"
            titleClassName="text-2xl"
            action={
              <Select
                value={modelUrl}
                onChange={handleModelChange}
                options={MODEL_OPTIONS.map((m) => ({ value: m.url, label: m.label }))}
                className="w-40"
              />
            }
          />
          <ModelViewer
            modelUrl={modelUrl}
            highlights={highlights}
            legend={ZONE_LEGEND}
            className="h-[420px] xl:h-[calc(100vh-158px)]"
          />
        </div>
      </div>
    </AppLayout>
  );
}
