// ---------------------------------------------------------------------------
// Central API client.
//
// Every service in this folder currently resolves against local mock data,
// but all calls are already routed through this client and marked `async`
// so that swapping the `USE_MOCK` flag (or the fetch implementation below)
// is the only change needed to point MedTwin at a real FastAPI backend.
// ---------------------------------------------------------------------------

export const API_BASE_URL = "http://localhost:8000/api";

export const USE_MOCK = true;

/** Simulated network latency so loading states are visible in the mock build. */
export function mockDelay<T>(data: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
