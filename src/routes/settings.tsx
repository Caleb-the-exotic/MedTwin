import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/pages/Settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MedTwin" },
      { name: "description", content: "Configure simulation fidelity, units, alert thresholds and workspace preferences." },
      { property: "og:title", content: "Settings — MedTwin" },
      { property: "og:description", content: "Configure simulation fidelity, units, alert thresholds and workspace preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});
