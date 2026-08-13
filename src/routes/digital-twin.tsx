import { createFileRoute } from "@tanstack/react-router";
import DigitalTwinPage from "@/pages/DigitalTwinPage";

export const Route = createFileRoute("/digital-twin")({
  head: () => ({
    meta: [
      { title: "Digital Twin — MedTwin" },
      { name: "description", content: "Inspect the live digital twin of your device coupled to a virtual patient model." },
      { property: "og:title", content: "Digital Twin — MedTwin" },
      { property: "og:description", content: "Inspect the live digital twin of your device coupled to a virtual patient model." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DigitalTwinPage,
});
