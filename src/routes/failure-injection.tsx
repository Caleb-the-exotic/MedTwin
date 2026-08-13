import { createFileRoute } from "@tanstack/react-router";
import FailureInjectionPage from "@/pages/FailureInjectionPage";

export const Route = createFileRoute("/failure-injection")({
  head: () => ({
    meta: [
      { title: "Failure Injection — MedTwin" },
      { name: "description", content: "Inject sensor faults, power loss and latency spikes to probe device resilience." },
      { property: "og:title", content: "Failure Injection — MedTwin" },
      { property: "og:description", content: "Inject sensor faults, power loss and latency spikes to probe device resilience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FailureInjectionPage,
});
