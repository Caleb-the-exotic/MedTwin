import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export function BarComparison({
  data,
  dataKey,
  xKey,
  color = "#4FD1C5",
  height = 220,
}: {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => Number(d[dataKey]) || 0));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`bar-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.28} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#212B37" strokeDasharray="2 6" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: "#5A6779", fontFamily: "Roboto Mono, monospace" }}
          axisLine={{ stroke: "#212B37" }}
          tickLine={false}
          dy={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#5A6779", fontFamily: "Roboto Mono, monospace" }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(16,21,28,0.96)",
            border: "1px solid #2E3A48",
            borderRadius: 10,
            fontSize: 12,
            padding: "8px 10px",
            boxShadow: "0 18px 40px -18px rgba(0,0,0,0.9)",
          }}
          labelStyle={{
            color: "#8C99AB",
            fontFamily: "Roboto Mono, monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
          itemStyle={{ color: "#E8EDF3", fontFamily: "Roboto Mono, monospace" }}
          cursor={{ fill: "rgba(79,209,197,0.06)" }}
        />
        <Bar dataKey={dataKey} fill={`url(#bar-${dataKey})`} radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={`url(#bar-${dataKey})`}
              stroke={Number(d[dataKey]) === max ? color : "transparent"}
              strokeWidth={Number(d[dataKey]) === max ? 1 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
