import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm animate-rise" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg animate-rise rounded-lg border border-hairline-bright bg-panel shadow-panel",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
          <h2 className="font-display text-sm font-medium text-ink">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-ink-muted hover:bg-panel-raised hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
