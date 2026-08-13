import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { VitalsSample } from "@/types";

const chartColors: Record<string, string> = {
  hr: "#F0555A",
  spo2: "#4FD1C5",
  systolic: "#9B8CFB",
  diastolic: "#6A5ED9",
  respiration: "#F5A623",
  temperature: "#37D399",
  glucose: "#E8EDF3",
};

export function VitalsLineChart({
  data,
  dataKey,
  domain,
  height = 180,
  strokeWidth = 2,
}: {
  data: VitalsSample[];
  dataKey: keyof VitalsSample;
  domain?: [number, number];
  height?: number;
  strokeWidth?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="#212B37" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#5A6779" }} axisLine={{ stroke: "#212B37" }} tickLine={false} />
        <YAxis domain={domain ?? ["auto", "auto"]} tick={{ fontSize: 10, fill: "#5A6779" }} axisLine={false} tickLine={false} width={34} />
        <Tooltip
          contentStyle={{ background: "#10151C", border: "1px solid #2E3A48", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#8C99AB" }}
          itemStyle={{ color: "#E8EDF3" }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={chartColors[dataKey] ?? "#4FD1C5"} strokeWidth={strokeWidth} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
