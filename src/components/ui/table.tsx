import React from "react";
import { cn } from "@/utils/cn";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="scrollbar-thin w-full overflow-x-auto rounded-lg border border-hairline/70">
      <table className={cn("w-full border-collapse text-[13px]", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-panel-raised/80 backdrop-blur-sm [&_th]:border-b [&_th]:border-hairline">
      {children}
    </thead>
  );
}

export function TH({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-hairline/70">{children}</tbody>;
}

export function TR({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-colors odd:bg-transparent even:bg-panel-raised/25 hover:bg-panel-raised/70",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("whitespace-nowrap px-3 py-2.5 text-ink tabular", className)}>{children}</td>
  );
}
