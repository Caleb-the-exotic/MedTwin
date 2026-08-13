import React, { useState } from "react";
import { FileText, Download, Eye, FlaskConical, ShieldAlert, AlertOctagon, Grid3x3 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { initialReports } from "@/data/mockData";
import { formatDateTime } from "@/utils/format";
import type { ReportItem } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";

const TYPE_META: Record<ReportItem["type"], { icon: React.ElementType; label: string; tone: "signal" | "safe" | "critical" | "violet" }> = {
  simulation: { icon: FlaskConical, label: "Simulation Report", tone: "signal" },
  safety: { icon: ShieldAlert, label: "Safety Report", tone: "safe" },
  "failure-analysis": { icon: AlertOctagon, label: "Failure Analysis", tone: "critical" },
  risk: { icon: Grid3x3, label: "Risk Report", tone: "violet" },
};

export default function Reports() {
  const { pushToast } = useAppStore();
  const [preview, setPreview] = useState<ReportItem | null>(null);

  function handleDownload(report: ReportItem) {
    pushToast({ title: "Report download started", description: `${report.title}.pdf`, tone: "signal" });
  }

  return (
    <AppLayout title="Reports" subtitle="Generated documentation for simulation runs, safety assessments and risk registers">
      <SectionHeader title="Report Library" description={`${initialReports.length} reports available`} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {initialReports.map((r) => {
          const meta = TYPE_META[r.type];
          const Icon = meta.icon;
          return (
            <Card key={r.id} className="flex flex-col p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-panel-raised">
                  <Icon className="h-4 w-4 text-ink-muted" />
                </div>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <p className="mt-3 text-sm font-medium text-ink leading-snug">{r.title}</p>
              <p className="mt-1.5 flex-1 text-xs text-ink-muted line-clamp-2">{r.summary}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
                <span>{r.device}</span>
                <span>{r.pages} pages</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-ink-faint">{formatDateTime(r.generatedAt)}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreview(r)}>
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleDownload(r)}>
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!preview} onClose={() => setPreview(null)} title={preview?.title ?? ""} className="max-w-xl">
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone={TYPE_META[preview.type].tone}>{TYPE_META[preview.type].label}</Badge>
              <span className="font-mono text-[11px] text-ink-faint">{preview.pages} pages · {formatDateTime(preview.generatedAt)}</span>
            </div>
            <p className="text-sm text-ink-muted">{preview.summary}</p>
            <div className="rounded-md border border-dashed border-hairline-bright bg-panel-raised p-4 text-center">
              <FileText className="mx-auto h-6 w-6 text-ink-faint" />
              <p className="mt-2 text-xs text-ink-muted">Demo report preview — full document available via export in the connected FastAPI service.</p>
            </div>
            <Button variant="primary" className="w-full" onClick={() => handleDownload(preview)}>
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        )}
      </Dialog>
    </AppLayout>
  );
}
