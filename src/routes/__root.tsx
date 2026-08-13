import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppStoreProvider } from "@/hooks/useAppStore";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="max-w-md rounded-xl border border-hairline bg-panel p-8 text-center shadow-panel">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">Signal lost</p>
        <h1 className="mt-3 font-mono text-6xl font-semibold text-signal tabular">404</h1>
        <h2 className="mt-4 text-lg font-semibold text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-ink-muted">
          This route isn't part of the MedTwin workspace.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md border border-signal/30 bg-signal/10 px-4 py-2 text-sm font-medium text-signal transition-colors hover:bg-signal/20"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="max-w-md rounded-xl border border-hairline bg-panel p-8 text-center shadow-panel">
        <h1 className="text-lg font-semibold text-ink">This page didn't load</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Something went wrong on our end. Try again or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md border border-signal/30 bg-signal/10 px-4 py-2 text-sm font-medium text-signal transition-colors hover:bg-signal/20"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-hairline px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-panel-raised hover:text-ink"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MedTwin — Digital Twin Platform for Medical Devices" },
      {
        name: "description",
        content:
          "Design, simulate and stress-test medical devices against virtual patients before physical prototyping.",
      },
      { property: "og:title", content: "MedTwin — Digital Twin Platform for Medical Devices" },
      {
        property: "og:description",
        content:
          "Design, simulate and stress-test medical devices against virtual patients before physical prototyping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AppStoreProvider>
    </QueryClientProvider>
  );
}
