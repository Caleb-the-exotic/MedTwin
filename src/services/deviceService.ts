import type { Device } from "@/types";
import { initialDevices } from "@/data/mockData";
import { mockDelay, USE_MOCK, apiFetch } from "./apiClient";

export const deviceService = {
  async list(): Promise<Device[]> {
    if (USE_MOCK) return mockDelay(initialDevices);
    return apiFetch<Device[]>("/devices");
  },
  async get(id: string): Promise<Device | undefined> {
    if (USE_MOCK) return mockDelay(initialDevices.find((d) => d.id === id));
    return apiFetch<Device>(`/devices/${id}`);
  },
  async save(device: Device): Promise<Device> {
    if (USE_MOCK) return mockDelay({ ...device, updatedAt: new Date().toISOString() });
    return apiFetch<Device>(`/devices/${device.id}`, { method: "PUT", body: JSON.stringify(device) });
  },
  async validate(device: Device): Promise<{ valid: boolean; issues: string[] }> {
    if (USE_MOCK) {
      const issues: string[] = [];
      if (!device.components.some((c) => c.kind === "safety")) issues.push("No safety interlock component present.");
      if (!device.components.some((c) => c.kind === "power")) issues.push("No power source defined.");
      if (device.connections.length < device.components.length - 1) issues.push("One or more components are not connected.");
      return mockDelay({ valid: issues.length === 0, issues }, 500);
    }
    return apiFetch(`/devices/${device.id}/validate`, { method: "POST" });
  },
};
