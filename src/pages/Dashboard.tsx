import { useMemo } from "react";
import { CircuitBoard, HeartPulse, FlaskConical } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModelViewer } from "@/components/twin/ModelViewer";
import DeviceDesigner from "@/pages/DeviceDesigner";
import PatientSimulator from "@/pages/PatientSimulator";
import SimulationLab from "@/pages/SimulationLab";
import { useAppStore } from "@/hooks/useAppStore";

const ZONE_LEGEND = [
  { zone: "top", label: "SpO2" },
  { zone: "upper", label: "Temp" },
  { zone: "center", label: "Heart Rate" },
  { zone: "lower", label: "Respiration" },
];

const DEFAULT_TEAL = "#4FD1C5";
const WARN_AMBER = "#F5A623";
const CRIT_RED = "#F0555A";

function zoneColor(value: number, warn: [number, number], crit: [number, number]): string {
  if (value < crit[0] || value > crit[1]) return CRIT_RED;
  if (value < warn[0] || value > warn[1]) return WARN_AMBER;
  return DEFAULT_TEAL;
}

export default function Dashboard() {
  const { twins, patients, selectedPatientId, sliderOverrides } = useAppStore();

  const twin = twins[0];

  const patient = patients.find((p) => p.id === selectedPatientId) ?? patients[0];
  const baseline = useMemo(
    () => ({ ...patient.baseline, ...sliderOverrides }),
    [patient, sliderOverrides],
  );

  const highlights = useMemo(
    () => ({
      top: zoneColor(baseline.spo2, [90, 100], [85, 100]),
      upper: zoneColor(baseline.temperature, [35, 38.5], [34.5, 39.5]),
      center: zoneColor(baseline.hr, [45, 150], [35, 180]),
      lower: zoneColor(baseline.respiration, [8, 28], [6, 32]),
    }),
    [baseline],
  );

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-[76px] xl:self-start">
          <SectionHeader title="Digital Twin Model" titleClassName="text-2xl" />
          <ModelViewer
            title={twin.deviceName}
            highlights={highlights}
            legend={ZONE_LEGEND}
            className="h-[420px] xl:h-[calc(100vh-158px)]"
          />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Vitals from the Patient Simulator drive zone colors on the model.
          </p>
        </div>

        <div className="min-w-0">
          <Tabs defaultValue="device-designer">
            <TabsList className="mb-4 flex w-full">
              <TabsTrigger value="device-designer" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <CircuitBoard className="h-3.5 w-3.5" /> Device Designer
                </span>
              </TabsTrigger>
              <TabsTrigger value="patient-simulator" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5" /> Patient Simulator
                </span>
              </TabsTrigger>
              <TabsTrigger value="simulation-lab" className="flex-1">
                <span className="flex items-center justify-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5" /> Simulation Lab
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="device-designer">
              <DeviceDesigner />
            </TabsContent>
            <TabsContent value="patient-simulator">
              <PatientSimulator />
            </TabsContent>
            <TabsContent value="simulation-lab">
              <SimulationLab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
