import { createFileRoute } from "@tanstack/react-router";
import TestResults from "@/pages/TestResults";

export const Route = createFileRoute("/test-results")({
  head: () => ({
    meta: [
      { title: "Test Results — MedTwin" },
      { name: "description", content: "Review pass/fail verification results across device builds and scenarios." },
      { property: "og:title", content: "Test Results — MedTwin" },
      { property: "og:description", content: "Review pass/fail verification results across device builds and scenarios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestResults,
});
