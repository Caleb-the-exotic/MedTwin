import type { ReportItem } from "@/types";
import { initialReports } from "@/data/mockData";
import { mockDelay, USE_MOCK, apiFetch } from "./apiClient";

export const reportService = {
  async list(): Promise<ReportItem[]> {
    if (USE_MOCK) return mockDelay(initialReports);
    return apiFetch<ReportItem[]>("/reports");
  },
};
