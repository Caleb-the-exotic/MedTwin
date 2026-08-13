import { createFileRoute } from "@tanstack/react-router";
import DatasetExplorer from "@/pages/DatasetExplorer";

export const Route = createFileRoute("/dataset-explorer")({
  head: () => ({
    meta: [
      { title: "Dataset Explorer — MedTwin" },
      { name: "description", content: "Browse simulated physiological datasets used to train and validate device logic." },
      { property: "og:title", content: "Dataset Explorer — MedTwin" },
      { property: "og:description", content: "Browse simulated physiological datasets used to train and validate device logic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DatasetExplorer,
});
