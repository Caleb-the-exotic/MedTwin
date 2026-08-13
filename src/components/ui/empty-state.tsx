import React from "react";
import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline-bright py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-panel-raised">
        <Icon className="h-5 w-5 text-ink-faint" />
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
