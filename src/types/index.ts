// ---------------------------------------------------------------------------
// MedTwin domain types
// ---------------------------------------------------------------------------

export type ComponentKind =
  | "sensor"
  | "controller"
  | "actuator"
  | "power"
  | "communication"
  | "safety";

export type ComponentStatus = "ok" | "warning" | "critical";

export interface DeviceComponent {
  id: string;
  kind: ComponentKind;
  label: string;
  x: number;
  y: number;
  status: ComponentStatus;
  properties: Record<string, string | number>;
}

export interface DeviceConnection {
  id: string;
  from: string;
  to: string;
}

export interface Device {
  id: string;
  name: string;
  deviceClass: string;
  version: string;
  status: "draft" | "validated" | "in-simulation" | "archived";
  createdAt: string;
  updatedAt: string;
  components: DeviceComponent[];
  connections: DeviceConnection[];
  description: string;
}

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface DigitalTwin {
  id: string;
  deviceId: string;
  deviceName: string;
  status: "running" | "idle" | "paused" | "error";
  fidelity: number;
  uptimeSec: number;
  lastSync: string;
  safetyScore: number;
  riskLevel: RiskLevel;
}

export interface VitalsSample {
  t: number;
  hr: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  respiration: number;
  temperature: number;
  glucose: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female";
  weightKg: number;
  condition: string;
  baseline: {
    hr: number;
    spo2: number;
    systolic: number;
    diastolic: number;
    respiration: number;
    temperature: number;
    glucose: number;
  };
}

export type PatientPreset =
  | "normal"
  | "tachycardia"
  | "hypoxia"
  | "hypotension"
  | "fever";

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  objective: string;
  conditions: string[];
  failureMode: string;
  expectedBehavior: string;
  riskLevel: RiskLevel;
  createdAt: string;
}

export type FailureType =
  | "sensor-failure"
  | "sensor-drift"
  | "signal-noise"
  | "communication-loss"
  | "battery-degradation"
  | "controller-delay"
  | "actuator-failure"
  | "incorrect-input";

export interface FailureInjection {
  id: string;
  type: FailureType;
  label: string;
  description: string;
  targetComponent: string;
  intensity: number;
  active: boolean;
  activatedAt?: string;
}

export interface TimelineEvent {
  id: string;
  t: number;
  label: string;
  severity: ComponentStatus;
  source: string;
}

export interface SimulationRun {
  id: string;
  name: string;
  deviceName: string;
  scenario: string;
  status: "running" | "paused" | "completed" | "stopped" | "queued";
  progress: number;
  startedAt: string;
  durationSec: number;
  safetyScore: number;
  anomalies: number;
}

export type TestStatus = "passed" | "failed" | "warning" | "critical";

export interface TestResult {
  id: string;
  name: string;
  category: string;
  device: string;
  status: TestStatus;
  duration: string;
  runAt: string;
  details: string;
}

export interface RiskMatrixItem {
  id: string;
  failureMode: string;
  cause: string;
  effect: string;
  likelihood: number; // 1-5
  severity: number; // 1-5
  mitigation: string;
  owner: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: ComponentStatus;
  time: string;
  source: string;
  read: boolean;
}

export interface AIFinding {
  id: string;
  title: string;
  description: string;
  confidence: number;
  severity: ComponentStatus;
  recommendation: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: "simulation" | "safety" | "failure-analysis" | "risk";
  device: string;
  generatedAt: string;
  pages: number;
  summary: string;
}

export interface DatasetRecord {
  id: string;
  timestamp: string;
  hr: number;
  spo2: number;
  systolic: number;
  diastolic: number;
  respiration: number;
  temperature: number;
  anomaly: boolean;
  label: string;
}
