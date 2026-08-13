import type { Scenario, RiskLevel } from "@/types";
import { mockDelay, USE_MOCK, apiFetch } from "./apiClient";

const riskWords: Record<string, RiskLevel> = {
  occlu: "high",
  overpressure: "critical",
  fail: "high",
  drift: "moderate",
  noise: "moderate",
  loss: "moderate",
  delay: "high",
  battery: "moderate",
};

function inferRisk(prompt: string): RiskLevel {
  const lower = prompt.toLowerCase();
  for (const key of Object.keys(riskWords)) {
    if (lower.includes(key)) return riskWords[key];
  }
  return "low";
}

/** Mock "AI" scenario generation — deterministic templating over the free-text prompt. */
export const scenarioService = {
  async generate(prompt: string): Promise<Scenario> {
    const risk = inferRisk(prompt);
    const scenario: Scenario = {
      id: `sc-${Date.now()}`,
      title: prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt,
      prompt,
      objective: `Determine whether the device maintains a safe state when the following is introduced: "${prompt}".`,
      conditions: [
        "Nominal operating temperature (20–24°C)",
        "Baseline patient vitals within normal range",
        `Condition trigger at t = ${20 + Math.floor(Math.random() * 100)}s`,
      ],
      failureMode: `Simulated deviation derived from: ${prompt}`,
      expectedBehavior: "Device detects the deviation, raises an appropriate alert and transitions to a fail-safe state within its specified response window.",
      riskLevel: risk,
      createdAt: new Date().toISOString(),
    };
    if (USE_MOCK) return mockDelay(scenario, 900);
    return apiFetch<Scenario>("/scenarios/generate", { method: "POST", body: JSON.stringify({ prompt }) });
  },
};
