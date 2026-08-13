import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Device,
  DigitalTwin,
  PatientProfile,
  PatientPreset,
  Scenario,
  FailureInjection,
  TimelineEvent,
  SimulationRun,
  Alert,
  VitalsSample,
} from "@/types";
import {
  initialDevices,
  initialTwins,
  initialPatients,
  initialScenarios,
  initialFailures,
  initialTimeline,
  initialSimulationRuns,
  initialAlerts,
} from "@/data/mockData";
import { computeSafety } from "@/services/riskService";
import { clamp } from "@/utils/format";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: "signal" | "amber" | "critical" | "safe";
};

const PRESETS: Record<PatientPreset, Partial<PatientProfile["baseline"]>> = {
  normal: {},
  tachycardia: { hr: 142, respiration: 22 },
  hypoxia: { spo2: 84, hr: 108, respiration: 26 },
  hypotension: { systolic: 78, diastolic: 48, hr: 118 },
  fever: { temperature: 39.4, hr: 104, respiration: 21 },
};

interface AppState {
  devices: Device[];
  selectedDeviceId: string;
  twins: DigitalTwin[];
  patients: PatientProfile[];
  selectedPatientId: string;
  preset: PatientPreset;
  sliderOverrides: Partial<PatientProfile["baseline"]>;
  vitalsHistory: VitalsSample[];
  scenarios: Scenario[];
  failures: FailureInjection[];
  timeline: TimelineEvent[];
  simulationRuns: SimulationRun[];
  simClock: { status: "running" | "paused" | "stopped"; elapsed: number };
  alerts: Alert[];
  toasts: Toast[];
  safetyScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  anomalyScore: number;
}

interface AppActions {
  selectDevice: (id: string) => void;
  saveDevice: (device: Device) => void;
  selectPatient: (id: string) => void;
  applyPreset: (preset: PatientPreset) => void;
  setSliderValue: (key: keyof PatientProfile["baseline"], value: number) => void;
  resetPatientVitals: () => void;
  toggleFailure: (id: string) => void;
  setFailureIntensity: (id: string, value: number) => void;
  resetFailures: () => void;
  addScenario: (scenario: Scenario) => void;
  simStart: () => void;
  simPause: () => void;
  simStop: () => void;
  simRestart: () => void;
  dismissToast: (id: string) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  markAlertRead: (id: string) => void;
  currentVitals: () => VitalsSample;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

function severityForIntensity(intensity: number): "ok" | "warning" | "critical" {
  if (intensity >= 66) return "critical";
  if (intensity >= 30) return "warning";
  return "ok";
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDevices[0].id);
  const [twins] = useState<DigitalTwin[]>(initialTwins);
  const [patients] = useState<PatientProfile[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatients[0].id);
  const [preset, setPreset] = useState<PatientPreset>("normal");
  const [sliderOverrides, setSliderOverrides] = useState<Partial<PatientProfile["baseline"]>>({});
  const [vitalsHistory, setVitalsHistory] = useState<VitalsSample[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [failures, setFailures] = useState<FailureInjection[]>(initialFailures);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [simulationRuns, setSimulationRuns] = useState<SimulationRun[]>(initialSimulationRuns);
  const [simClock, setSimClock] = useState<{
    status: "running" | "paused" | "stopped";
    elapsed: number;
  }>({
    status: "running",
    elapsed: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tRef = useRef(0);

  const { safetyScore, riskLevel, anomalyScore } = useMemo(
    () => computeSafety(failures),
    [failures],
  );

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const selectDevice = useCallback((id: string) => setSelectedDeviceId(id), []);

  const saveDevice = useCallback(
    (device: Device) => {
      setDevices((prev) => prev.map((d) => (d.id === device.id ? device : d)));
      pushToast({
        title: "Device saved",
        description: `${device.name} updated successfully.`,
        tone: "safe",
      });
    },
    [pushToast],
  );

  const selectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
    setSliderOverrides({});
    setPreset("normal");
  }, []);

  const applyPreset = useCallback(
    (p: PatientPreset) => {
      setPreset(p);
      setSliderOverrides(PRESETS[p]);
      pushToast({
        title: `Preset applied: ${p[0].toUpperCase()}${p.slice(1)}`,
        description: "Patient vitals updated across live charts.",
        tone: p === "normal" ? "safe" : "amber",
      });
    },
    [pushToast],
  );

  const setSliderValue = useCallback((key: keyof PatientProfile["baseline"], value: number) => {
    setPreset("normal");
    setSliderOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetPatientVitals = useCallback(() => {
    setSliderOverrides({});
    setPreset("normal");
    pushToast({
      title: "Patient vitals reset",
      description: "Simulator controls returned to the patient baseline.",
      tone: "safe",
    });
  }, [pushToast]);

  const toggleFailure = useCallback(
    (id: string) => {
      setFailures((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const nextActive = !f.active;
          const intensity = nextActive ? (f.intensity === 0 ? 40 : f.intensity) : f.intensity;
          const event: TimelineEvent = {
            id: `evt-${Date.now()}`,
            t: tRef.current,
            label: `${f.label} ${nextActive ? "activated" : "cleared"} on ${f.targetComponent}`,
            severity: nextActive ? severityForIntensity(intensity) : "ok",
            source: f.targetComponent,
          };
          setTimeline((prevT) => [event, ...prevT].slice(0, 60));
          pushToast({
            title: nextActive ? `Failure injected: ${f.label}` : `Failure cleared: ${f.label}`,
            description: `${f.targetComponent} — intensity ${intensity}%`,
            tone: nextActive ? (intensity >= 66 ? "critical" : "amber") : "safe",
          });
          if (nextActive) {
            setAlerts((prevA) =>
              [
                {
                  id: `alert-${Date.now()}`,
                  title: `${f.label} injected on ${f.targetComponent}`,
                  message: `Intensity set to ${intensity}%. Monitoring downstream effects on safety score.`,
                  severity: severityForIntensity(intensity),
                  time: new Date().toISOString(),
                  source: f.targetComponent,
                  read: false,
                },
                ...prevA,
              ].slice(0, 30),
            );
          }
          return {
            ...f,
            active: nextActive,
            intensity,
            activatedAt: nextActive ? new Date().toISOString() : f.activatedAt,
          };
        }),
      );
    },
    [pushToast],
  );

  const setFailureIntensity = useCallback((id: string, value: number) => {
    setFailures((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (f.active && Math.abs(value - f.intensity) >= 25) {
          const event: TimelineEvent = {
            id: `evt-${Date.now()}`,
            t: tRef.current,
            label: `${f.label} intensity changed to ${value}% on ${f.targetComponent}`,
            severity: severityForIntensity(value),
            source: f.targetComponent,
          };
          setTimeline((prevT) => [event, ...prevT].slice(0, 60));
        }
        return { ...f, intensity: value };
      }),
    );
  }, []);

  const resetFailures = useCallback(() => {
    setFailures(initialFailures);
    setTimeline((prev) => [
      {
        id: `evt-${Date.now()}`,
        t: tRef.current,
        label: "All failure injections cleared",
        severity: "ok",
        source: "System",
      },
      ...prev,
    ]);
    pushToast({
      title: "Failures reset",
      description: "All injected failures have been cleared.",
      tone: "safe",
    });
  }, [pushToast]);

  const addScenario = useCallback(
    (scenario: Scenario) => {
      setScenarios((prev) => [scenario, ...prev]);
      pushToast({ title: "Scenario generated", description: scenario.title, tone: "signal" });
    },
    [pushToast],
  );

  const simStart = useCallback(() => setSimClock((c) => ({ ...c, status: "running" })), []);
  const simPause = useCallback(() => setSimClock((c) => ({ ...c, status: "paused" })), []);
  const simStop = useCallback(() => setSimClock({ status: "stopped", elapsed: 0 }), []);
  const simRestart = useCallback(() => setSimClock({ status: "running", elapsed: 0 }), []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  // Central simulation clock — advances timeline pointer while running.
  useEffect(() => {
    if (simClock.status !== "running") return;
    const interval = setInterval(() => {
      setSimClock((c) => ({ ...c, elapsed: c.elapsed + 1 }));
      tRef.current += 1;
    }, 1000);
    return () => clearInterval(interval);
  }, [simClock.status]);

  const currentVitals = useCallback((): VitalsSample => {
    const patient = patients.find((p) => p.id === selectedPatientId) ?? patients[0];
    const base = { ...patient.baseline, ...sliderOverrides };
    const activeFailures = failures.filter((f) => f.active);
    const noiseFailure = activeFailures.find((f) => f.type === "signal-noise");
    const driftFailure = activeFailures.find((f) => f.type === "sensor-drift");
    const noiseAmt = noiseFailure ? (noiseFailure.intensity / 100) * 8 : 1.2;
    const drift = driftFailure ? (driftFailure.intensity / 100) * 6 : 0;
    const jitter = () => (Math.random() - 0.5) * noiseAmt;
    return {
      t: tRef.current,
      hr: Math.round(clamp(base.hr + jitter() * 2, 30, 220)),
      spo2: Math.round(clamp(base.spo2 - drift * 0.4 + jitter() * 0.3, 60, 100)),
      systolic: Math.round(clamp(base.systolic + jitter() * 1.5, 50, 220)),
      diastolic: Math.round(clamp(base.diastolic + jitter(), 30, 140)),
      respiration: Math.round(clamp(base.respiration + jitter() * 0.4, 4, 60)),
      temperature: Math.round((base.temperature + jitter() * 0.05) * 10) / 10,
      glucose: Math.round(clamp(base.glucose + jitter() * 1.5, 40, 300)),
    };
  }, [patients, selectedPatientId, sliderOverrides, failures]);

  // Rolling vitals buffer for charts.
  useEffect(() => {
    const interval = setInterval(() => {
      setVitalsHistory((prev) => {
        const next = [...prev, currentVitals()];
        return next.slice(-40);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentVitals]);

  const value: AppState & AppActions = {
    devices,
    selectedDeviceId,
    twins,
    patients,
    selectedPatientId,
    preset,
    sliderOverrides,
    vitalsHistory,
    scenarios,
    failures,
    timeline,
    simulationRuns,
    simClock,
    alerts,
    toasts,
    safetyScore,
    riskLevel,
    anomalyScore,
    selectDevice,
    saveDevice,
    selectPatient,
    applyPreset,
    setSliderValue,
    resetPatientVitals,
    toggleFailure,
    setFailureIntensity,
    resetFailures,
    addScenario,
    simStart,
    simPause,
    simStop,
    simRestart,
    dismissToast,
    pushToast,
    markAlertRead,
    currentVitals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

export { PRESETS };
