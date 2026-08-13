import React, { useState } from "react";
import {
  Wand2,
  Sparkles,
  Target,
  ListChecks,
  AlertOctagon,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, statusTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/hooks/useAppStore";
import { scenarioService } from "@/services/scenarioService";
import { formatRelativeTime } from "@/utils/format";

const EXAMPLES = [
  "Simulate a downstream line occlusion while the pump runs at maximum rate",
  "Introduce SpO2 sensor drift during patient motion artifacts",
  "Battery degrades mid-infusion under peak actuator load",
  "Controller experiences processing delay during high respiration rate",
];

export default function ScenarioGenerator() {
  const { scenarios, addScenario } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    const scenario = await scenarioService.generate(prompt.trim());
    addScenario(scenario);
    setGenerating(false);
    setPrompt("");
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Describe a Scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={5}
              placeholder="e.g. Simulate a downstream line occlusion while the pump runs at maximum rate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
            >
              <Wand2 className="h-3.5 w-3.5" />
              {generating ? "Generating scenario..." : "Generate Scenario"}
            </Button>

            <div className="border-t border-hairline pt-3">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                <Sparkles className="h-3 w-3" /> Try an example
              </p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="rounded-md border border-hairline bg-panel-raised px-2.5 py-2 text-left text-[11px] text-ink-muted transition-colors hover:border-signal/40 hover:text-ink"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {generating && (
            <Card className="p-4">
              <div className="flex items-center gap-2 text-xs text-ink-muted mb-3">
                <Clock className="h-3.5 w-3.5 animate-pulse text-signal" /> Running mock AI scenario
                synthesis...
              </div>
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-full mb-1.5" />
              <Skeleton className="h-3 w-5/6" />
            </Card>
          )}

          {scenarios.length === 0 && !generating ? (
            <EmptyState
              icon={Wand2}
              title="No scenarios yet"
              description="Describe a test condition on the left to generate your first structured scenario."
            />
          ) : (
            scenarios.map((s) => (
              <Card key={s.id} className="animate-rise">
                <CardHeader>
                  <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal">
                    {s.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(s.riskLevel)}>{s.riskLevel} risk</Badge>
                    <span className="font-mono text-[10px] text-ink-faint">
                      {formatRelativeTime(s.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <ScenarioRow icon={Target} label="Objective" value={s.objective} />
                  <ScenarioRow
                    icon={ListChecks}
                    label="Conditions"
                    value={
                      <ul className="mt-1 space-y-1">
                        {s.conditions.map((c, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 font-mono text-xs text-ink-muted"
                          >
                            <span className="h-1 w-1 rounded-full bg-signal" /> {c}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                  <ScenarioRow icon={AlertOctagon} label="Failure Mode" value={s.failureMode} />
                  <ScenarioRow
                    icon={CheckCircle2}
                    label="Expected Behavior"
                    value={s.expectedBehavior}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function ScenarioRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-hairline bg-panel-raised">
        <Icon className="h-3.5 w-3.5 text-ink-faint" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</p>
        {typeof value === "string" ? <p className="mt-0.5 text-sm text-ink">{value}</p> : value}
      </div>
    </div>
  );
}
