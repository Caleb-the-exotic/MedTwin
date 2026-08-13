import React from "react";
import { cn } from "@/utils/cn";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  tone?: "signal" | "amber" | "critical" | "violet";
  danger?: (v: number) => boolean;
}

export function Slider({ label, value, min, max, step = 1, unit = "", onChange, tone = "signal", danger }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const isDanger = danger?.(value);
  const toneColor: Record<string, string> = {
    signal: "#4FD1C5",
    amber: "#F5A623",
    critical: "#F0555A",
    violet: "#9B8CFB",
  };
  const color = isDanger ? toneColor.critical : toneColor[tone];

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-ink-muted">{label}</label>
        <span
          className="font-mono text-xs tabular font-semibold"
          style={{ color }}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("slider-input w-full")}
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #212B37 ${pct}%)`,
        }}
      />
    </div>
  );
}
