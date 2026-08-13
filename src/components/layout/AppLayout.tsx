import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "@/components/shared/Toaster";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="grid-panel flex-1 px-5 py-5">
          <div className="mx-auto w-full max-w-[1600px] animate-rise">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
