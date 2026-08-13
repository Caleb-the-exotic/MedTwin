import { createFileRoute } from "@tanstack/react-router";
import SimulationLab from "@/pages/SimulationLab";

export const Route = createFileRoute("/simulation-lab")({
  head: () => ({
    meta: [
      { title: "Simulation Lab — MedTwin" },
      { name: "description", content: "Run, queue and monitor device simulation batches with live vitals telemetry." },
      { property: "og:title", content: "Simulation Lab — MedTwin" },
      { property: "og:description", content: "Run, queue and monitor device simulation batches with live vitals telemetry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SimulationLab,
});
