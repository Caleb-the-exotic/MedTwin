import type { SimulationRun, TimelineEvent } from "@/types";
import { initialSimulationRuns } from "@/data/mockData";
import { mockDelay, USE_MOCK, apiFetch } from "./apiClient";

export const simulationService = {
  async list(): Promise<SimulationRun[]> {
    if (USE_MOCK) return mockDelay(initialSimulationRuns);
    return apiFetch<SimulationRun[]>("/simulations");
  },
  async start(runId: string): Promise<{ ok: true }> {
    if (USE_MOCK) return mockDelay({ ok: true as const }, 200);
    return apiFetch(`/simulations/${runId}/start`, { method: "POST" });
  },
  async stop(runId: string): Promise<{ ok: true }> {
    if (USE_MOCK) return mockDelay({ ok: true as const }, 200);
    return apiFetch(`/simulations/${runId}/stop`, { method: "POST" });
  },
  async timeline(): Promise<TimelineEvent[]> {
    if (USE_MOCK) return mockDelay([]);
    return apiFetch<TimelineEvent[]>("/simulations/timeline");
  },
};
