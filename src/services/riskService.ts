import type { RiskMatrixItem, RiskLevel, FailureInjection } from "@/types";
import { initialRiskMatrix } from "@/data/mockData";
import { mockDelay, USE_MOCK, apiFetch } from "./apiClient";

export function riskScoreOf(item: { likelihood: number; severity: number }): number {
  return item.likelihood * item.severity;
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 16) return "critical";
  if (score >= 9) return "high";
  if (score >= 4) return "moderate";
  return "low";
}

/** Derives an overall safety score + risk level + anomaly score from active failure injections. */
export function computeSafety(failures: FailureInjection[]): {
  safetyScore: number;
  riskLevel: RiskLevel;
  anomalyScore: number;
} {
  const active = failures.filter((f) => f.active);
  if (active.length === 0) {
    return { safetyScore: 97, riskLevel: "low", anomalyScore: 3 };
  }
  const weight: Record<string, number> = {
    "sensor-failure": 0.32,
    "actuator-failure": 0.34,
    "controller-delay": 0.3,
    "communication-loss": 0.18,
    "sensor-drift": 0.22,
    "signal-noise": 0.16,
    "battery-degradation": 0.2,
    "incorrect-input": 0.26,
  };
  let deduction = 0;
  let anomaly = 0;
  for (const f of active) {
    const w = weight[f.type] ?? 0.2;
    deduction += (f.intensity / 100) * w * 100;
    anomaly += (f.intensity / 100) * 26;
  }
  const safetyScore = Math.max(2, Math.round(97 - deduction));
  const anomalyScore = Math.min(100, Math.round(anomaly + 3));
  let riskLevel: RiskLevel = "low";
  if (safetyScore < 40) riskLevel = "critical";
  else if (safetyScore < 65) riskLevel = "high";
  else if (safetyScore < 85) riskLevel = "moderate";
  return { safetyScore, riskLevel, anomalyScore };
}

export const riskService = {
  async matrix(): Promise<RiskMatrixItem[]> {
    if (USE_MOCK) return mockDelay(initialRiskMatrix);
    return apiFetch<RiskMatrixItem[]>("/risk/matrix");
  },
};
