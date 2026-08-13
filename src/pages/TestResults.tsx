import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldX, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge, statusTone } from "@/components/ui/badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { initialTestResults } from "@/data/mockData";
import { formatRelativeTime } from "@/utils/format";
import type { TestStatus } from "@/types";

export default function TestResults() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TestStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(initialTestResults.map((t) => t.category)))],
    [],
  );

  const counts = useMemo(() => {
    return {
      passed: initialTestResults.filter((t) => t.status === "passed").length,
      failed: initialTestResults.filter((t) => t.status === "failed").length,
      warning: initialTestResults.filter((t) => t.status === "warning").length,
      critical: initialTestResults.filter((t) => t.status === "critical").length,
    };
  }, []);

  const filtered = initialTestResults.filter((t) => {
    const matchesQuery = `${t.name} ${t.device}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Passed" value={counts.passed} tone="safe" />
        <StatCard icon={AlertTriangle} label="Warning" value={counts.warning} tone="amber" />
        <StatCard icon={XCircle} label="Failed" value={counts.failed} tone="critical" />
        <StatCard icon={ShieldX} label="Critical" value={counts.critical} tone="critical" />
      </div>

      <SectionHeader
        title="Test Runs"
        description={`${filtered.length} of ${initialTestResults.length} results`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
              <Input
                placeholder="Search tests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-52 pl-8"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-40"
              options={categories.map((c) => ({
                value: c,
                label: c === "all" ? "All Categories" : c,
              }))}
            />
            <Select
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as any)}
              className="w-36"
              options={[
                { value: "all", label: "All Status" },
                { value: "passed", label: "Passed" },
                { value: "warning", label: "Warning" },
                { value: "failed", label: "Failed" },
                { value: "critical", label: "Critical" },
              ]}
            />
          </div>
        }
      />

      <Card>
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Search}
              title="No matching tests"
              description="Try adjusting your filters or search query."
            />
          </div>
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Test</TH>
                <TH>Category</TH>
                <TH>Device</TH>
                <TH>Status</TH>
                <TH>Duration</TH>
                <TH>Run At</TH>
              </tr>
            </THead>
            <TBody>
              {filtered.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-[11px] text-ink-faint">{t.details}</p>
                  </TD>
                  <TD className="text-ink-muted">{t.category}</TD>
                  <TD className="text-ink-muted">{t.device}</TD>
                  <TD>
                    <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  </TD>
                  <TD className="font-mono">{t.duration}</TD>
                  <TD className="font-mono text-ink-faint">{formatRelativeTime(t.runAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </AppLayout>
  );
}
