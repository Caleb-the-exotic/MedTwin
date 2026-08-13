import { createFileRoute } from "@tanstack/react-router";
import Reports from "@/pages/Reports";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — MedTwin" },
      { name: "description", content: "Generate submission-ready validation and safety documentation packages." },
      { property: "og:title", content: "Reports — MedTwin" },
      { property: "og:description", content: "Generate submission-ready validation and safety documentation packages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});
