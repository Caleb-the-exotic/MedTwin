import type {
  Device,
  DigitalTwin,
  PatientProfile,
  Scenario,
  FailureInjection,
  SimulationRun,
  TestResult,
  RiskMatrixItem,
  Alert,
  AIFinding,
  ReportItem,
  DatasetRecord,
  TimelineEvent,
} from "@/types";

const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60000).toISOString();

export const initialDevices: Device[] = [
  {
    id: "dev-01",
    name: "InfusaSync IQ-200",
    deviceClass: "Infusion Pump",
    version: "v2.3.0",
    status: "in-simulation",
    createdAt: iso(60 * 24 * 12),
    updatedAt: iso(30),
    description: "Closed-loop infusion pump with adaptive dosing controller and dual redundant flow sensors.",
    components: [
      { id: "c1", kind: "sensor", label: "Flow Sensor", x: 60, y: 80, status: "ok", properties: { range: "0-500 mL/h", accuracy: "±2%" } },
      { id: "c2", kind: "sensor", label: "Pressure Sensor", x: 60, y: 200, status: "ok", properties: { range: "0-300 mmHg", accuracy: "±1.5%" } },
      { id: "c3", kind: "controller", label: "Dosing Controller", x: 260, y: 140, status: "ok", properties: { loopRate: "50 Hz", firmware: "3.1.2" } },
      { id: "c4", kind: "actuator", label: "Peristaltic Actuator", x: 460, y: 140, status: "ok", properties: { torque: "12 mNm", steps: "200/rev" } },
      { id: "c5", kind: "power", label: "Battery Module", x: 260, y: 300, status: "ok", properties: { capacity: "2600 mAh", chemistry: "Li-ion" } },
      { id: "c6", kind: "communication", label: "BLE Telemetry", x: 460, y: 280, status: "ok", properties: { protocol: "BLE 5.2", range: "10 m" } },
      { id: "c7", kind: "safety", label: "Occlusion Guard", x: 460, y: 40, status: "ok", properties: { threshold: "300 mmHg", response: "<200 ms" } },
    ],
    connections: [
      { id: "e1", from: "c1", to: "c3" },
      { id: "e2", from: "c2", to: "c3" },
      { id: "e3", from: "c3", to: "c4" },
      { id: "e4", from: "c5", to: "c3" },
      { id: "e5", from: "c3", to: "c6" },
      { id: "e6", from: "c3", to: "c7" },
    ],
  },
  {
    id: "dev-02",
    name: "CardioSense V-Loop",
    deviceClass: "Cardiac Monitor",
    version: "v1.4.1",
    status: "validated",
    createdAt: iso(60 * 24 * 40),
    updatedAt: iso(60 * 6),
    description: "Wearable ECG patch with arrhythmia detection and edge inference controller.",
    components: [
      { id: "c1", kind: "sensor", label: "ECG Lead Array", x: 60, y: 100, status: "ok", properties: { channels: 3, sampleRate: "512 Hz" } },
      { id: "c2", kind: "controller", label: "Inference MCU", x: 260, y: 100, status: "ok", properties: { model: "ArrhythNet-Lite", latency: "40 ms" } },
      { id: "c3", kind: "communication", label: "LTE-M Radio", x: 460, y: 100, status: "warning", properties: { protocol: "LTE-M", uplink: "250 kbps" } },
      { id: "c4", kind: "power", label: "Coin Cell Pack", x: 260, y: 240, status: "ok", properties: { capacity: "220 mAh", chemistry: "LiMnO2" } },
      { id: "c5", kind: "safety", label: "Fall-back Alarm", x: 460, y: 240, status: "ok", properties: { mode: "local buzzer" } },
    ],
    connections: [
      { id: "e1", from: "c1", to: "c2" },
      { id: "e2", from: "c2", to: "c3" },
      { id: "e3", from: "c4", to: "c2" },
      { id: "e4", from: "c2", to: "c5" },
    ],
  },
  {
    id: "dev-03",
    name: "VentAssist Neo",
    deviceClass: "Neonatal Ventilator",
    version: "v0.9.0-beta",
    status: "draft",
    createdAt: iso(60 * 24 * 3),
    updatedAt: iso(90),
    description: "Pressure-controlled neonatal ventilator with breath-synchronized actuation.",
    components: [
      { id: "c1", kind: "sensor", label: "Airway Pressure Sensor", x: 60, y: 80, status: "ok", properties: { range: "0-80 cmH2O" } },
      { id: "c2", kind: "sensor", label: "Flow Transducer", x: 60, y: 200, status: "ok", properties: { range: "0-30 L/min" } },
      { id: "c3", kind: "controller", label: "Breath Controller", x: 260, y: 140, status: "warning", properties: { mode: "PC-SIMV" } },
      { id: "c4", kind: "actuator", label: "Valve Actuator", x: 460, y: 140, status: "ok", properties: { response: "<50 ms" } },
      { id: "c5", kind: "safety", label: "Overpressure Relief", x: 460, y: 40, status: "ok", properties: { threshold: "45 cmH2O" } },
    ],
    connections: [
      { id: "e1", from: "c1", to: "c3" },
      { id: "e2", from: "c2", to: "c3" },
      { id: "e3", from: "c3", to: "c4" },
      { id: "e4", from: "c3", to: "c5" },
    ],
  },
];

export const initialTwins: DigitalTwin[] = [
  { id: "twin-01", deviceId: "dev-01", deviceName: "InfusaSync IQ-200", status: "running", fidelity: 94, uptimeSec: 5423, lastSync: iso(0), safetyScore: 91, riskLevel: "low" },
  { id: "twin-02", deviceId: "dev-02", deviceName: "CardioSense V-Loop", status: "idle", fidelity: 88, uptimeSec: 1890, lastSync: iso(12), safetyScore: 85, riskLevel: "moderate" },
  { id: "twin-03", deviceId: "dev-03", deviceName: "VentAssist Neo", status: "paused", fidelity: 76, uptimeSec: 640, lastSync: iso(45), safetyScore: 68, riskLevel: "high" },
];

export const initialPatients: PatientProfile[] = [
  {
    id: "pt-01",
    name: "Virtual Patient — Adult Male",
    age: 58,
    sex: "male",
    weightKg: 82,
    condition: "Post-operative cardiac monitoring",
    baseline: { hr: 72, spo2: 98, systolic: 118, diastolic: 76, respiration: 15, temperature: 36.8, glucose: 96 },
  },
  {
    id: "pt-02",
    name: "Virtual Patient — Adult Female",
    age: 34,
    sex: "female",
    weightKg: 64,
    condition: "ICU sepsis observation",
    baseline: { hr: 88, spo2: 96, systolic: 108, diastolic: 68, respiration: 18, temperature: 37.4, glucose: 110 },
  },
  {
    id: "pt-03",
    name: "Virtual Patient — Neonate",
    age: 0,
    sex: "female",
    weightKg: 3.2,
    condition: "NICU respiratory support",
    baseline: { hr: 132, spo2: 95, systolic: 68, diastolic: 42, respiration: 44, temperature: 36.9, glucose: 70 },
  },
];

export const initialScenarios: Scenario[] = [
  {
    id: "sc-01",
    title: "Occlusion during high-rate infusion",
    prompt: "Simulate a downstream line occlusion while the pump is delivering at maximum programmed rate.",
    objective: "Verify the occlusion guard trips before pressure exceeds patient-safe threshold.",
    conditions: ["Flow rate: 400 mL/h", "Line occluded at t=120s", "Ambient temp: 24°C"],
    failureMode: "Progressive pressure build-up behind occlusion point",
    expectedBehavior: "Alarm within 200ms of threshold breach; actuator halts within 500ms",
    riskLevel: "high",
    createdAt: iso(180),
  },
  {
    id: "sc-02",
    title: "SpO2 sensor drift under motion artifact",
    prompt: "Introduce gradual SpO2 sensor drift while patient motion artifacts are present.",
    objective: "Assess whether the controller correctly flags low-confidence readings instead of acting on them.",
    conditions: ["Baseline SpO2: 97%", "Drift rate: 0.3%/min", "Motion artifact: intermittent"],
    failureMode: "Sensor reports false desaturation trend",
    expectedBehavior: "Confidence-weighted rejection of drifted samples; no false actuation",
    riskLevel: "moderate",
    createdAt: iso(340),
  },
];

export const initialFailures: FailureInjection[] = [
  { id: "f1", type: "sensor-failure", label: "Sensor Failure", description: "Hard failure — sensor stops reporting entirely.", targetComponent: "Flow Sensor", intensity: 0, active: false },
  { id: "f2", type: "sensor-drift", label: "Sensor Drift", description: "Gradual measurement bias accumulating over time.", targetComponent: "Pressure Sensor", intensity: 0, active: false },
  { id: "f3", type: "signal-noise", label: "Signal Noise", description: "Increased variance injected into sensor readings.", targetComponent: "ECG Lead Array", intensity: 0, active: false },
  { id: "f4", type: "communication-loss", label: "Communication Loss", description: "Telemetry link drops intermittently or fully.", targetComponent: "BLE Telemetry", intensity: 0, active: false },
  { id: "f5", type: "battery-degradation", label: "Battery Degradation", description: "Simulated capacity fade and voltage sag under load.", targetComponent: "Battery Module", intensity: 0, active: false },
  { id: "f6", type: "controller-delay", label: "Controller Delay", description: "Added latency in the control loop response.", targetComponent: "Dosing Controller", intensity: 0, active: false },
  { id: "f7", type: "actuator-failure", label: "Actuator Failure", description: "Actuator response degrades or sticks under load.", targetComponent: "Peristaltic Actuator", intensity: 0, active: false },
  { id: "f8", type: "incorrect-input", label: "Incorrect Input", description: "Malformed or out-of-range input values are injected.", targetComponent: "Dosing Controller", intensity: 0, active: false },
];

export const initialTimeline: TimelineEvent[] = [
  { id: "t1", t: 0, label: "Simulation environment initialized", severity: "ok", source: "System" },
  { id: "t2", t: 4, label: "Digital twin synchronized with device model", severity: "ok", source: "Twin Sync" },
];

export const initialSimulationRuns: SimulationRun[] = [
  { id: "run-01", name: "Occlusion Stress Test", deviceName: "InfusaSync IQ-200", scenario: "Occlusion during high-rate infusion", status: "running", progress: 62, startedAt: iso(8), durationSec: 480, safetyScore: 88, anomalies: 1 },
  { id: "run-02", name: "SpO2 Drift Validation", deviceName: "CardioSense V-Loop", scenario: "SpO2 sensor drift under motion artifact", status: "completed", progress: 100, startedAt: iso(120), durationSec: 360, safetyScore: 94, anomalies: 0 },
  { id: "run-03", name: "Cold-start Battery Sag", deviceName: "InfusaSync IQ-200", scenario: "Battery degradation on cold boot", status: "queued", progress: 0, startedAt: iso(-30), durationSec: 300, safetyScore: 0, anomalies: 0 },
  { id: "run-04", name: "Breath Sync Latency", deviceName: "VentAssist Neo", scenario: "Controller delay under high respiration rate", status: "stopped", progress: 41, startedAt: iso(720), durationSec: 300, safetyScore: 61, anomalies: 4 },
];

export const initialTestResults: TestResult[] = [
  { id: "tr-01", name: "Occlusion detection latency", category: "Safety", device: "InfusaSync IQ-200", status: "passed", duration: "4m 12s", runAt: iso(8), details: "Alarm triggered in 184ms, within 200ms threshold." },
  { id: "tr-02", name: "SpO2 drift rejection", category: "Sensor", device: "CardioSense V-Loop", status: "passed", duration: "6m 00s", runAt: iso(120), details: "Controller rejected 97% of drifted low-confidence samples." },
  { id: "tr-03", name: "Battery sag under peak load", category: "Power", device: "InfusaSync IQ-200", status: "warning", duration: "3m 40s", runAt: iso(200), details: "Voltage dipped to 3.31V, below nominal but above cutoff." },
  { id: "tr-04", name: "Controller loop jitter", category: "Controller", device: "VentAssist Neo", status: "failed", duration: "5m 02s", runAt: iso(720), details: "Loop jitter exceeded 12ms tolerance under injected delay." },
  { id: "tr-05", name: "Communication loss recovery", category: "Communication", device: "CardioSense V-Loop", status: "warning", duration: "2m 18s", runAt: iso(300), details: "Reconnected after 3.2s, above 2s target." },
  { id: "tr-06", name: "Actuator stall detection", category: "Actuator", device: "InfusaSync IQ-200", status: "passed", duration: "4m 55s", runAt: iso(400), details: "Stall detected and flagged within one control cycle." },
  { id: "tr-07", name: "Overpressure relief valve", category: "Safety", device: "VentAssist Neo", status: "critical", duration: "1m 58s", runAt: iso(50), details: "Relief valve failed to actuate at 45 cmH2O threshold." },
  { id: "tr-08", name: "Incorrect dose input rejection", category: "Controller", device: "InfusaSync IQ-200", status: "passed", duration: "2m 40s", runAt: iso(600), details: "Out-of-range dose commands rejected and logged." },
];

export const initialRiskMatrix: RiskMatrixItem[] = [
  { id: "rm-01", failureMode: "Occlusion guard fails to trip", cause: "Pressure sensor drift masks true reading", effect: "Over-pressurization, potential line rupture", likelihood: 2, severity: 5, mitigation: "Dual redundant pressure sensors with cross-check", owner: "Systems Eng." },
  { id: "rm-02", failureMode: "False desaturation alarm", cause: "SpO2 motion artifact misclassified", effect: "Unnecessary clinical intervention", likelihood: 3, severity: 2, mitigation: "Confidence-weighted filtering algorithm", owner: "Signal Proc." },
  { id: "rm-03", failureMode: "Battery brown-out mid-infusion", cause: "Capacity fade not detected pre-op", effect: "Infusion halts unexpectedly", likelihood: 2, severity: 4, mitigation: "Pre-use battery health check + low-power fallback", owner: "Power Eng." },
  { id: "rm-04", failureMode: "Actuator sticking under load", cause: "Mechanical wear in peristaltic rollers", effect: "Delivered dose deviates from programmed rate", likelihood: 3, severity: 4, mitigation: "Torque monitoring with stall detection", owner: "Mech. Eng." },
  { id: "rm-05", failureMode: "Telemetry blackout", cause: "BLE interference in clinical environment", effect: "Loss of remote monitoring visibility", likelihood: 4, severity: 2, mitigation: "Local buffering + store-and-forward sync", owner: "Firmware" },
  { id: "rm-06", failureMode: "Control loop overrun", cause: "Injected processing delay under load", effect: "Delayed actuation response", likelihood: 2, severity: 5, mitigation: "Watchdog timer with fail-safe hold state", owner: "Controls" },
];

export const initialAlerts: Alert[] = [
  { id: "a1", title: "Occlusion pressure nearing threshold", message: "Line pressure at 268 mmHg, 32 mmHg below trip point.", severity: "warning", time: iso(6), source: "InfusaSync IQ-200", read: false },
  { id: "a2", title: "Telemetry link degraded", message: "LTE-M signal strength dropped to -108 dBm.", severity: "warning", time: iso(22), source: "CardioSense V-Loop", read: false },
  { id: "a3", title: "Overpressure relief test failed", message: "Relief valve did not actuate at 45 cmH2O during scheduled test.", severity: "critical", time: iso(50), source: "VentAssist Neo", read: false },
  { id: "a4", title: "Simulation completed successfully", message: "SpO2 Drift Validation finished with safety score 94.", severity: "ok", time: iso(120), source: "Simulation Lab", read: true },
];

export const initialAIFindings: AIFinding[] = [
  { id: "af1", title: "Pressure sensor drift correlates with occlusion masking", description: "Across 14 simulated runs, gradual pressure sensor drift beyond 3% delayed occlusion alarm triggering by an average of 340ms.", confidence: 92, severity: "critical", recommendation: "Add cross-validation against flow-derived pressure estimate before suppressing alarms." },
  { id: "af2", title: "Battery voltage sag predicts actuator torque loss", description: "Actuator torque output showed a 0.87 correlation with battery voltage sag events under peak current draw.", confidence: 85, severity: "warning", recommendation: "Introduce a minimum-voltage interlock before allowing high-torque actuation commands." },
  { id: "af3", title: "Communication loss recovery within tolerance", description: "97% of simulated communication loss events recovered within the 5-second target window.", confidence: 88, severity: "ok", recommendation: "No action required; continue monitoring in extended field trials." },
];

export const initialReports: ReportItem[] = [
  { id: "rp1", title: "InfusaSync IQ-200 — Occlusion Stress Test Report", type: "simulation", device: "InfusaSync IQ-200", generatedAt: iso(8), pages: 12, summary: "Full telemetry, controller response and alarm timing analysis for the occlusion stress scenario." },
  { id: "rp2", title: "CardioSense V-Loop — Safety Assessment", type: "safety", device: "CardioSense V-Loop", generatedAt: iso(120), pages: 9, summary: "Aggregated safety score trend, risk distribution and AI-flagged anomalies over the last 30 runs." },
  { id: "rp3", title: "VentAssist Neo — Overpressure Failure Analysis", type: "failure-analysis", device: "VentAssist Neo", generatedAt: iso(52), pages: 7, summary: "Root-cause investigation of the failed relief valve actuation during scheduled safety testing." },
  { id: "rp4", title: "Fleet-wide Risk Register — Q3", type: "risk", device: "All Devices", generatedAt: iso(2400), pages: 15, summary: "Likelihood × severity matrix across all active digital twins with mitigation ownership." },
];

function seedDataset(): DatasetRecord[] {
  const labels = ["normal", "tachycardia", "hypoxia", "hypotension", "fever"];
  const recs: DatasetRecord[] = [];
  for (let i = 0; i < 60; i++) {
    const anomaly = Math.random() < 0.18;
    const label = anomaly ? labels[1 + Math.floor(Math.random() * 4)] : "normal";
    recs.push({
      id: `ds-${i + 1}`,
      timestamp: iso(60 * (60 - i)),
      hr: Math.round(70 + (anomaly ? Math.random() * 45 : Math.random() * 10 - 5)),
      spo2: Math.round((anomaly && label === "hypoxia" ? 88 + Math.random() * 5 : 96 + Math.random() * 3) * 10) / 10,
      systolic: Math.round(115 + (anomaly && label === "hypotension" ? -30 + Math.random() * 10 : Math.random() * 12 - 6)),
      diastolic: Math.round(75 + (anomaly && label === "hypotension" ? -15 + Math.random() * 8 : Math.random() * 8 - 4)),
      respiration: Math.round(15 + Math.random() * 4),
      temperature: Math.round((36.7 + (anomaly && label === "fever" ? 1.5 + Math.random() : Math.random() * 0.4 - 0.2)) * 10) / 10,
      anomaly,
      label,
    });
  }
  return recs;
}

export const initialDataset: DatasetRecord[] = seedDataset();
