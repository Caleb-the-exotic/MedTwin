import React, { useState } from "react";
import { User, FlaskConical, Sparkles, Bell, Palette, Server, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/useAppStore";
import { API_BASE_URL } from "@/services/apiClient";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${checked ? "border-signal/40 bg-signal/30" : "border-hairline bg-panel-raised"}`}
    >
      <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ink transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-ink">{label}</p>
        {description && <p className="text-[11px] text-ink-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { pushToast } = useAppStore();
  const [notifications, setNotifications] = useState({ critical: true, warnings: true, reports: false, digest: true });
  const [simSettings, setSimSettings] = useState({ tickRate: "1000", fidelity: "high", autoStop: true });
  const [aiSettings, setAiSettings] = useState({ model: "medtwin-safety-v2", confidenceThreshold: "75" });
  const [theme, setTheme] = useState("dark-lab");

  return (
    <AppLayout title="Settings" subtitle="Configure profile, simulation defaults, AI behavior and appearance">
      <Tabs defaultValue="profile">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="profile"><User className="mr-1 inline h-3 w-3" /> Profile</TabsTrigger>
          <TabsTrigger value="simulation"><FlaskConical className="mr-1 inline h-3 w-3" /> Simulation</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="mr-1 inline h-3 w-3" /> AI</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1 inline h-3 w-3" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1 inline h-3 w-3" /> Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Engineer Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="mb-1 block text-[11px] text-ink-muted">Full Name</label><Input defaultValue="Jordan Reyes" /></div>
              <div><label className="mb-1 block text-[11px] text-ink-muted">Role</label><Input defaultValue="Medical Device Systems Engineer" /></div>
              <div><label className="mb-1 block text-[11px] text-ink-muted">Organization</label><Input defaultValue="MedTwin Labs" /></div>
              <div><label className="mb-1 block text-[11px] text-ink-muted">Email</label><Input defaultValue="jordan.reyes@medtwin.dev" /></div>
              <Button variant="primary" onClick={() => pushToast({ title: "Profile saved", tone: "safe" })}><Save className="h-3.5 w-3.5" /> Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Simulation Defaults</CardTitle></CardHeader>
            <CardContent className="divide-y divide-hairline">
              <Row label="Tick Rate" description="Simulation clock resolution">
                <Select value={simSettings.tickRate} onChange={(v) => setSimSettings((s) => ({ ...s, tickRate: v }))} className="w-32" options={[{ value: "250", label: "250 ms" }, { value: "500", label: "500 ms" }, { value: "1000", label: "1000 ms" }]} />
              </Row>
              <Row label="Default Fidelity" description="Digital twin model resolution">
                <Select value={simSettings.fidelity} onChange={(v) => setSimSettings((s) => ({ ...s, fidelity: v }))} className="w-32" options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
              </Row>
              <Row label="Auto-stop on critical" description="Halt simulation automatically if safety score drops below 20">
                <Toggle checked={simSettings.autoStop} onChange={() => setSimSettings((s) => ({ ...s, autoStop: !s.autoStop }))} />
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>AI Analysis Settings</CardTitle></CardHeader>
            <CardContent className="divide-y divide-hairline">
              <Row label="Analysis Model" description="Model used for safety scoring and findings">
                <Select value={aiSettings.model} onChange={(v) => setAiSettings((s) => ({ ...s, model: v }))} className="w-48" options={[{ value: "medtwin-safety-v2", label: "MedTwin Safety v2" }, { value: "medtwin-safety-v1", label: "MedTwin Safety v1" }]} />
              </Row>
              <Row label="Confidence Threshold" description="Minimum confidence to surface a finding">
                <Input value={aiSettings.confidenceThreshold} onChange={(e) => setAiSettings((s) => ({ ...s, confidenceThreshold: e.target.value }))} className="w-20" />
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="divide-y divide-hairline">
              <Row label="Critical alerts" description="Immediate notification for critical-severity events">
                <Toggle checked={notifications.critical} onChange={() => setNotifications((n) => ({ ...n, critical: !n.critical }))} />
              </Row>
              <Row label="Warnings" description="Notify on warning-level anomalies">
                <Toggle checked={notifications.warnings} onChange={() => setNotifications((n) => ({ ...n, warnings: !n.warnings }))} />
              </Row>
              <Row label="Report generation" description="Notify when a new report is ready">
                <Toggle checked={notifications.reports} onChange={() => setNotifications((n) => ({ ...n, reports: !n.reports }))} />
              </Row>
              <Row label="Weekly digest" description="Summary of fleet-wide safety trends">
                <Toggle checked={notifications.digest} onChange={() => setNotifications((n) => ({ ...n, digest: !n.digest }))} />
              </Row>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="max-w-xl">
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Row label="Theme" description="MedTwin currently ships a single dark laboratory theme">
                <Select value={theme} onChange={setTheme} className="w-40" options={[{ value: "dark-lab", label: "Dark Lab" }]} />
              </Row>
              <div className="rounded-md border border-hairline bg-panel-raised p-3">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-ink-faint" />
                  <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">API Endpoint</p>
                </div>
                <p className="mt-1.5 font-mono text-xs text-ink">{API_BASE_URL}</p>
                <p className="mt-1 text-[11px] text-ink-muted">MedTwin currently runs on local mock data. Connect a FastAPI backend at this address to enable live device telemetry.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
