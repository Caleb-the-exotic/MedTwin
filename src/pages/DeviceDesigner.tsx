import React, { useMemo, useRef, useState } from "react";
import {
  CircuitBoard,
  Radio,
  Cpu,
  Zap,
  Battery,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge, statusTone } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/useAppStore";
import { deviceService } from "@/services/deviceService";
import type { ComponentKind, Device, DeviceComponent } from "@/types";

const KIND_META: Record<ComponentKind, { icon: React.ElementType; color: string }> = {
  sensor: { icon: Radio, color: "#4FD1C5" },
  controller: { icon: Cpu, color: "#9B8CFB" },
  actuator: { icon: Zap, color: "#F5A623" },
  power: { icon: Battery, color: "#37D399" },
  communication: { icon: Radio, color: "#4FD1C5" },
  safety: { icon: ShieldCheck, color: "#F0555A" },
};

export default function DeviceDesigner() {
  const { devices, selectedDeviceId, selectDevice, saveDevice } = useAppStore();
  const device = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId) ?? devices[0],
    [devices, selectedDeviceId],
  );
  const [localDevice, setLocalDevice] = useState<Device>(device);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    device.components[0]?.id ?? null,
  );
  const [validation, setValidation] = useState<{ valid: boolean; issues: string[] } | null>(null);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  React.useEffect(() => {
    setLocalDevice(device);
    setSelectedComponentId(device.components[0]?.id ?? null);
    setValidation(null);
  }, [device]);

  const selectedComponent =
    localDevice.components.find((c) => c.id === selectedComponentId) ?? null;

  function updateComponent(id: string, patch: Partial<DeviceComponent>) {
    setLocalDevice((d) => ({
      ...d,
      components: d.components.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  function updateProperty(key: string, value: string) {
    if (!selectedComponent) return;
    updateComponent(selectedComponent.id, {
      properties: { ...selectedComponent.properties, [key]: value },
    });
  }

  function onPointerDown(e: React.PointerEvent, comp: DeviceComponent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragState.current = {
      id: comp.id,
      offsetX: e.clientX - rect.left - comp.x,
      offsetY: e.clientY - rect.top - comp.y,
    };
    setSelectedComponentId(comp.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(rect.width - 140, e.clientX - rect.left - dragState.current.offsetX),
    );
    const y = Math.max(
      0,
      Math.min(rect.height - 70, e.clientY - rect.top - dragState.current.offsetY),
    );
    updateComponent(dragState.current.id, { x, y });
  }

  function onPointerUp() {
    dragState.current = null;
  }

  async function handleValidate() {
    setValidating(true);
    setValidation(null);
    const result = await deviceService.validate(localDevice);
    setValidation(result);
    setValidating(false);
  }

  async function handleSave() {
    setSaving(true);
    const saved = await deviceService.save(localDevice);
    saveDevice(saved);
    setSaving(false);
  }

  return (
    <>
      <SectionHeader
        title={localDevice.name}
        description={`${localDevice.deviceClass} · ${localDevice.version}`}
        action={
          <div className="flex items-center gap-2">
            <Select
              value={selectedDeviceId}
              onChange={selectDevice}
              options={devices.map((d) => ({ value: d.id, label: d.name }))}
              className="w-56"
            />
            <Button variant="outline" size="md" onClick={handleValidate} disabled={validating}>
              {validating ? "Validating..." : "Validate"}
            </Button>
            <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
              <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Device"}
            </Button>
          </div>
        }
      />

      {validation && (
        <div
          className={`mb-4 flex items-start gap-2.5 rounded-lg border p-3 text-sm ${validation.valid ? "border-safe/30 bg-safe/5 text-safe" : "border-amber/30 bg-amber/5 text-amber"}`}
        >
          {validation.valid ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>
            <p className="font-medium">
              {validation.valid ? "Device passed validation" : "Validation found issues"}
            </p>
            {!validation.valid && (
              <ul className="mt-1 list-inside list-disc text-xs text-ink-muted">
                {validation.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Block Diagram Canvas</CardTitle>
            <span className="flex items-center gap-1 text-[11px] text-ink-faint">
              <CircuitBoard className="h-3.5 w-3.5" /> drag blocks to reposition
            </span>
          </CardHeader>
          <div
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="grid-panel relative h-[560px] select-none overflow-hidden border-t border-hairline bg-void/40"
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {localDevice.connections.map((conn) => {
                const from = localDevice.components.find((c) => c.id === conn.from);
                const to = localDevice.components.find((c) => c.id === conn.to);
                if (!from || !to) return null;
                const x1 = from.x + 70,
                  y1 = from.y + 35,
                  x2 = to.x + 70,
                  y2 = to.y + 35;
                const midX = (x1 + x2) / 2;
                return (
                  <path
                    key={conn.id}
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#2E3A48"
                    strokeWidth={1.5}
                  />
                );
              })}
            </svg>
            {localDevice.components.map((comp) => {
              const meta = KIND_META[comp.kind];
              const Icon = meta.icon;
              const active = comp.id === selectedComponentId;
              return (
                <div
                  key={comp.id}
                  onPointerDown={(e) => onPointerDown(e, comp)}
                  style={{
                    left: comp.x,
                    top: comp.y,
                    borderColor: active ? meta.color : undefined,
                  }}
                  className={`absolute flex w-[140px] cursor-grab flex-col gap-1 rounded-lg border bg-panel/95 p-2.5 shadow-panel backdrop-blur transition-shadow active:cursor-grabbing ${active ? "shadow-glow" : "border-hairline"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                      style={{ backgroundColor: `${meta.color}1A` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                    </div>
                    <span className="truncate text-[11px] font-medium text-ink">{comp.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">
                      {comp.kind}
                    </span>
                    <Badge tone={statusTone(comp.status)} className="px-1.5 py-0 text-[9px]">
                      {comp.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Component Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedComponent ? (
              <>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-ink-muted">Label</label>
                  <Input
                    value={selectedComponent.label}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, { label: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-ink-muted">
                    Status
                  </label>
                  <Select
                    value={selectedComponent.status}
                    onChange={(v) =>
                      updateComponent(selectedComponent.id, {
                        status: v as DeviceComponent["status"],
                      })
                    }
                    options={[
                      { value: "ok", label: "OK" },
                      { value: "warning", label: "Warning" },
                      { value: "critical", label: "Critical" },
                    ]}
                  />
                </div>
                <div className="border-t border-hairline pt-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                    Properties
                  </p>
                  <div className="space-y-2">
                    {Object.entries(selectedComponent.properties).map(([key, value]) => (
                      <div key={key}>
                        <label className="mb-1 block text-[11px] capitalize text-ink-muted">
                          {key}
                        </label>
                        <Input
                          value={String(value)}
                          onChange={(e) => updateProperty(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-ink-muted">
                Select a component on the canvas to edit its properties.
              </p>
            )}

            <div className="border-t border-hairline pt-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                Component Palette
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(KIND_META) as ComponentKind[]).map((kind) => {
                  const meta = KIND_META[kind];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={kind}
                      className="flex flex-col items-center gap-1 rounded-md border border-hairline bg-panel-raised py-2"
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.color }} />
                      <span className="text-[9px] capitalize text-ink-faint">{kind}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
