import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export function MiniArea({ data, dataKey, color = "#4FD1C5", height = 56 }: { data: any[]; dataKey: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.75} fill={`url(#grad-${dataKey})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
