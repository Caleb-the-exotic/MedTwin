import { createFileRoute } from "@tanstack/react-router";
import RiskAssessment from "@/pages/RiskAssessment";

export const Route = createFileRoute("/risk-assessment")({
  head: () => ({
    meta: [
      { title: "Risk Assessment — MedTwin" },
      { name: "description", content: "Severity vs likelihood risk matrix with mitigation tracking for each hazard." },
      { property: "og:title", content: "Risk Assessment — MedTwin" },
      { property: "og:description", content: "Severity vs likelihood risk matrix with mitigation tracking for each hazard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiskAssessment,
});
