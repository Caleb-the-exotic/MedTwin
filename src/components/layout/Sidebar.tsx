import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CircuitBoard,
  Activity,
  HeartPulse,
  Wand2,
  FlaskConical,
  Zap,
  ShieldAlert,
  ListChecks,
  Grid3x3,
  FileText,
  Database,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_GROUPS: {
  label: string;
  items: { to: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Design",
    items: [
      { to: "/device-designer", label: "Device Designer", icon: CircuitBoard },
      { to: "/digital-twin", label: "Digital Twin", icon: Activity },
      { to: "/patient-simulator", label: "Patient Simulator", icon: HeartPulse },
    ],
  },
  {
    label: "Simulate",
    items: [
      { to: "/scenario-generator", label: "Scenario Generator", icon: Wand2 },
      { to: "/simulation-lab", label: "Simulation Lab", icon: FlaskConical },
      { to: "/failure-injection", label: "Failure Injection", icon: Zap },
    ],
  },
  {
    label: "Assure",
    items: [
      { to: "/ai-safety-analysis", label: "AI Safety Analysis", icon: ShieldAlert },
      { to: "/test-results", label: "Test Results", icon: ListChecks },
      { to: "/risk-assessment", label: "Risk Assessment", icon: Grid3x3 },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/dataset-explorer", label: "Dataset Explorer", icon: Database },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-hairline bg-panel/95 backdrop-blur-md transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-[252px]",
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-hairline px-4">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-signal/30 bg-signal/10 shadow-glow">
          <Stethoscope className="h-4 w-4 text-signal" />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-blink rounded-full bg-safe" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-wide text-ink">MedTwin</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              Digital Twin Suite
            </span>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2.5 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-3 last:mb-0">
            {!collapsed && (
              <p className="px-2.5 pb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint/70">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mx-2.5 mb-2 h-px bg-hairline" />}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-all duration-150",
                        isActive
                          ? "bg-signal/10 font-medium text-signal"
                          : "text-ink-muted hover:bg-panel-raised hover:text-ink",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r bg-signal shadow-glow" />
                      )}
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-signal" : "text-ink-faint group-hover:text-ink-muted",
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-2.5 mb-2 rounded-md border border-hairline bg-panel-raised/60 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
              Solver
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-safe">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-safe" />
              online
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-hairline">
            <div className="h-full w-[62%] rounded-full bg-signal/70" />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-ink-faint tabular">62% compute in use</p>
        </div>
      )}

      <div className="border-t border-hairline p-2.5">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-ink-faint transition-colors hover:bg-panel-raised hover:text-ink-muted"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
