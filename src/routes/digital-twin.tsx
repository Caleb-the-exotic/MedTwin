import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/digital-twin")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
