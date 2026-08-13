import React from "react";
import { Header } from "./Header";
import { Toaster } from "@/components/shared/Toaster";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Header />
      <main className="grid-panel flex-1 px-5 py-5">
        <div className="mx-auto w-full max-w-[1600px] animate-rise">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
