import React, { useMemo, useState } from "react";
import { Grid3x3 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { Badge, statusTone } from "@/components/ui/badge";
import { initialRiskMatrix } from "@/data/mockData";
import { riskScoreOf, riskLevelFromScore } from "@/services/riskService";
import { cn } from "@/utils/cn";

const LIKELIHOOD_LABELS = ["Rare", "Unlikely", "Possible", "Likely", "Frequent"];
const SEVERITY_LABELS = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];

export default function RiskAssessment() {
  const [hovered, setHovered] = useState<{ l: number; s: number } | null>(null);

  const cellCounts = useMemo(() => {
    const map: Record<string, number> = {};
    initialRiskMatrix.forEach((item) => {
      const key = `${item.likelihood}-${item.severity}`;
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <AppLayout title="Risk Assessment" subtitle="Likelihood × severity matrix mapped against identified failure modes and mitigations">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Risk Matrix</CardTitle>
            <Grid3x3 className="h-3.5 w-3.5 text-ink-faint" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[64px_repeat(5,1fr)] gap-1">
              <div />
              {SEVERITY_LABELS.map((s, i) => (
                <div key={s} className="flex items-end justify-center pb-1 text-center font-mono text-[9px] text-ink-faint">
                  {i + 1}
                </div>
              ))}
              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={l}>
                  <div className="flex items-center justify-end pr-2 text-right font-mono text-[9px] text-ink-faint">
                    {l} · {LIKELIHOOD_LABELS[l - 1]}
                  </div>
                  {[1, 2, 3, 4, 5].map((s) => {
                    const score = l * s;
                    const level = riskLevelFromScore(score);
                    const count = cellCounts[`${l}-${s}`] ?? 0;
                    const bg =
                      level === "critical" ? "bg-critical/70" : level === "high" ? "bg-critical/35" : level === "moderate" ? "bg-amber/35" : "bg-safe/25";
                    return (
                      <div
                        key={s}
                        onMouseEnter={() => setHovered({ l, s })}
                        onMouseLeave={() => setHovered(null)}
                        className={cn("relative flex aspect-square items-center justify-center rounded-sm text-[10px] font-mono text-ink/80 transition-transform hover:scale-105", bg)}
                      >
                        {score}
                        {count > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-panel text-[8px] font-bold text-ink ring-1 ring-hairline-bright">
                            {count}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-ink-faint">
              <span>Severity →</span>
              <span>↑ Likelihood</span>
            </div>
            {hovered && (
              <div className="mt-3 rounded-md border border-hairline bg-panel-raised px-3 py-2 text-xs text-ink-muted">
                Likelihood <span className="text-ink font-medium">{LIKELIHOOD_LABELS[hovered.l - 1]}</span> × Severity{" "}
                <span className="text-ink font-medium">{SEVERITY_LABELS[hovered.s - 1]}</span> = score{" "}
                <span className="font-mono text-ink font-semibold">{hovered.l * hovered.s}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failure Mode & Effects</CardTitle>
          </CardHeader>
          <Table>
            <THead>
              <tr>
                <TH>Failure Mode</TH>
                <TH>Cause</TH>
                <TH>Effect</TH>
                <TH>Score</TH>
                <TH>Risk</TH>
                <TH>Mitigation</TH>
                <TH>Owner</TH>
              </tr>
            </THead>
            <TBody>
              {initialRiskMatrix.map((item) => {
                const score = riskScoreOf(item);
                const level = riskLevelFromScore(score);
                return (
                  <TR key={item.id}>
                    <TD className="font-medium max-w-[180px] whitespace-normal">{item.failureMode}</TD>
                    <TD className="text-ink-muted max-w-[160px] whitespace-normal">{item.cause}</TD>
                    <TD className="text-ink-muted max-w-[180px] whitespace-normal">{item.effect}</TD>
                    <TD className="font-mono tabular">{item.likelihood} × {item.severity} = {score}</TD>
                    <TD><Badge tone={statusTone(level)}>{level}</Badge></TD>
                    <TD className="text-ink-muted max-w-[200px] whitespace-normal">{item.mitigation}</TD>
                    <TD className="text-ink-faint">{item.owner}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
