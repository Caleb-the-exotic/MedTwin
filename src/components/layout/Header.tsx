import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wand2,
  Zap,
  ShieldAlert,
  ListChecks,
  Grid3x3,
  FileText,
  Database,
  Settings,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS: { to: string; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scenario-generator", label: "Scenario Generator", icon: Wand2 },
  { to: "/failure-injection", label: "Failure Injection", icon: Zap },
  { to: "/ai-safety-analysis", label: "AI Safety Analysis", icon: ShieldAlert },
  { to: "/test-results", label: "Test Results", icon: ListChecks },
  { to: "/risk-assessment", label: "Risk Assessment", icon: Grid3x3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/dataset-explorer", label: "Dataset Explorer", icon: Database },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-hairline bg-panel/80 px-4 backdrop-blur-md">
      <Link to="/" className="flex shrink-0 items-center gap-2.5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-signal/30 bg-signal/10 shadow-glow">
          <Stethoscope className="h-4 w-4 text-signal" />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-blink rounded-full bg-safe" />
        </div>
        <span className="text-[13px] font-semibold tracking-wide text-ink">MedTwin</span>
      </Link>

      <nav className="scrollbar-thin flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150",
                isActive
                  ? "bg-signal/10 font-medium text-signal"
                  : "text-ink-muted hover:bg-panel-raised hover:text-ink",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-signal" : "text-ink-faint",
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          to="/settings"
          title="Settings"
          aria-label="Settings"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            pathname.startsWith("/settings")
              ? "bg-signal/10 text-signal"
              : "text-ink-muted hover:bg-panel-raised hover:text-ink",
          )}
        >
          <Settings className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}
