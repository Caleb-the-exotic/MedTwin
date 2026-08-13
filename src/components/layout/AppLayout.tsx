import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "@/components/shared/Toaster";

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <main className="grid-panel flex-1 px-5 py-5">
          <div className="mx-auto w-full max-w-[1600px] animate-rise">{children}</div>
          <div className="mx-auto mt-10 w-full max-w-[1600px] border-t border-hairline pb-2 pt-4">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              <span>MedTwin v1.0</span>
              <span className="h-1 w-1 rounded-full bg-hairline-bright" />
              <span>Research prototype</span>
              <span className="h-1 w-1 rounded-full bg-hairline-bright" />
              <span>Not for clinical use</span>
            </div>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] leading-relaxed text-ink-faint">
              This project is an engineering/research prototype and is not intended for clinical
              diagnosis, treatment or real-world medical decision-making.
            </p>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
