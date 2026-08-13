import { createFileRoute } from "@tanstack/react-router";
import ScenarioGenerator from "@/pages/ScenarioGenerator";

export const Route = createFileRoute("/scenario-generator")({
  head: () => ({
    meta: [
      { title: "Scenario Generator — MedTwin" },
      { name: "description", content: "Generate edge-case clinical scenarios to stress-test device behaviour." },
      { property: "og:title", content: "Scenario Generator — MedTwin" },
      { property: "og:description", content: "Generate edge-case clinical scenarios to stress-test device behaviour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenarioGenerator,
});
