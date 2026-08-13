import React from "react";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <span className="mt-1.5 h-3.5 w-[2px] shrink-0 rounded-full bg-signal/70" />
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
