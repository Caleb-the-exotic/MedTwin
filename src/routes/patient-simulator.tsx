import { createFileRoute } from "@tanstack/react-router";
import PatientSimulator from "@/pages/PatientSimulator";

export const Route = createFileRoute("/patient-simulator")({
  head: () => ({
    meta: [
      { title: "Patient Simulator — MedTwin" },
      { name: "description", content: "Build virtual patient cohorts with tunable physiology and comorbidity profiles." },
      { property: "og:title", content: "Patient Simulator — MedTwin" },
      { property: "og:description", content: "Build virtual patient cohorts with tunable physiology and comorbidity profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PatientSimulator,
});
