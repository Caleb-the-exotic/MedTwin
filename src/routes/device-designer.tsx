import { createFileRoute } from "@tanstack/react-router";
import DeviceDesigner from "@/pages/DeviceDesigner";

export const Route = createFileRoute("/device-designer")({
  head: () => ({
    meta: [
      { title: "Device Designer — MedTwin" },
      { name: "description", content: "Define medical device parameters, sensors and control logic before physical prototyping." },
      { property: "og:title", content: "Device Designer — MedTwin" },
      { property: "og:description", content: "Define medical device parameters, sensors and control logic before physical prototyping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeviceDesigner,
});
