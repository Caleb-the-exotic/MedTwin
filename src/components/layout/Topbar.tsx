import React, { useState } from "react";
import { Bell, Search, Wifi, Activity, Command } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { Badge, statusTone } from "@/components/ui/badge";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { alerts, markAlertRead, safetyScore, riskLevel } = useAppStore();
  const [open, setOpen] = useState(false);
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-hairline bg-panel/80 px-5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-panel-raised sm:flex">
          <Activity className="h-3.5 w-3.5 text-signal" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="truncate text-xs text-ink-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="group hidden items-center gap-2 rounded-md border border-hairline bg-panel-raised px-3 py-1.5 transition-colors focus-within:border-signal/40 md:flex">
          <Search className="h-3.5 w-3.5 text-ink-faint" />
          <input
            placeholder="Search devices, runs, reports..."
            className="w-52 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
          />
          <span className="flex items-center gap-0.5 rounded border border-hairline-bright px-1 font-mono text-[9px] text-ink-faint">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-md border border-hairline bg-panel-raised/50 px-2.5 py-1.5 lg:flex">
          <Wifi className="h-3.5 w-3.5 text-safe" />
          <span className="font-mono text-[11px] text-ink-muted">
            Safety <span className="font-semibold text-ink tabular">{safetyScore}</span>
          </span>
          <span className="h-3 w-px bg-hairline-bright" />
          <Badge tone={statusTone(riskLevel)} dot>
            {riskLevel}
          </Badge>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-ink-muted transition-colors hover:border-signal/30 hover:bg-panel-raised hover:text-ink"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 font-mono text-[9px] font-bold text-void">
                {unread}
              </span>
            )}
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-80 animate-rise overflow-hidden rounded-xl border border-hairline-bright bg-panel shadow-panel-lg">
                <div className="flex items-center justify-between border-b border-hairline px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-ink">Notifications</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {unread} new / {alerts.length}
                  </span>
                </div>
                <div className="scrollbar-thin max-h-80 overflow-y-auto">
                  {alerts.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => markAlertRead(a.id)}
                      className={cn(
                        "flex w-full flex-col gap-0.5 border-b border-hairline px-3.5 py-2.5 text-left transition-colors last:border-0 hover:bg-panel-raised",
                        !a.read && "bg-panel-raised/40",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            a.read ? "bg-hairline-bright" : "bg-signal",
                          )}
                        />
                        <span className="truncate text-xs font-medium text-ink">{a.title}</span>
                      </div>
                      <p className="line-clamp-2 pl-3.5 text-[11px] text-ink-muted">{a.message}</p>
                      <span className="pl-3.5 font-mono text-[10px] text-ink-faint">
                        {formatRelativeTime(a.time)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-signal/25 bg-signal/10 font-mono text-[11px] font-semibold text-signal">
          CS
        </div>
      </div>
    </header>
  );
}
