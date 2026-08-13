import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedTwin Dashboard — Digital Twin Device Command Center" },
      { name: "description", content: "Live safety score, device fleet status and simulation telemetry for medical device development." },
      { property: "og:title", content: "MedTwin Dashboard — Digital Twin Device Command Center" },
      { property: "og:description", content: "Live safety score, device fleet status and simulation telemetry for medical device development." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
