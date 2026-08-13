import { createFileRoute } from "@tanstack/react-router";
import AISafetyAnalysis from "@/pages/AISafetyAnalysis";

export const Route = createFileRoute("/ai-safety-analysis")({
  head: () => ({
    meta: [
      { title: "AI Safety Analysis — MedTwin" },
      { name: "description", content: "AI-assisted hazard detection and mitigation guidance across simulation runs." },
      { property: "og:title", content: "AI Safety Analysis — MedTwin" },
      { property: "og:description", content: "AI-assisted hazard detection and mitigation guidance across simulation runs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AISafetyAnalysis,
});
