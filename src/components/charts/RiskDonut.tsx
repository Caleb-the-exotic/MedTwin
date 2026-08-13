import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function RiskDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} startAngle={90} endAngle={-270}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="#10151C" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
