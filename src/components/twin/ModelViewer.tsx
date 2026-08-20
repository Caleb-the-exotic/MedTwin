import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Box3, Vector3 } from "three";
import { RotateCcw, RefreshCw, Box, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/hooks/useAppStore";

export const DEFAULT_MODEL_URL = "/models/Man.obj";

export const MODEL_ZONES: { id: string; label: string; min: number; max: number }[] = [
  { id: "top", label: "Top", min: 0.72, max: 1 },
  { id: "upper", label: "Upper", min: 0.38, max: 0.72 },
  { id: "center", label: "Center", min: 0.12, max: 0.38 },
  { id: "lower", label: "Lower", min: 0, max: 0.12 },
];

type Axis = "x" | "y" | "z";

function zoneForCoord(
  coord: number,
  axisMin: number,
  axisRange: number,
  zones: typeof MODEL_ZONES,
): string {
  const t = (coord - axisMin) / axisRange;
  for (const zone of zones) {
    if (t >= zone.min) return zone.id;
  }
  return zones[zones.length - 1].id;
}

const BASE_COLORS: Record<string, number> = {
  body: 0x4fd1c5,
  tubes: 0x9aa7b5,
  ring: 0xa78bfa,
};

function buildHeartModel(): THREE.Group {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.9);
  shape.bezierCurveTo(0.9, 0.4, 1.5, 0.9, 1.0, 1.8);
  shape.bezierCurveTo(0.65, 2.35, 0.25, 2.2, 0, 1.75);
  shape.bezierCurveTo(-0.25, 2.2, -0.65, 2.35, -1.0, 1.8);
  shape.bezierCurveTo(-1.5, 0.9, -0.9, 0.4, 0, 0.9);

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.14,
      bevelThickness: 0.18,
    }),
    new THREE.MeshStandardMaterial({
      color: BASE_COLORS.body,
      metalness: 0.45,
      roughness: 0.22,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.12,
    }),
  );
  body.name = "body";
  body.geometry.rotateX(Math.PI / 2);
  body.geometry.rotateY(Math.PI);
  body.geometry.center();
  body.geometry.translate(0, 0.6, 0);

  const inlet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 1.7, 32),
    new THREE.MeshStandardMaterial({ color: BASE_COLORS.tubes, metalness: 0.85, roughness: 0.32 }),
  );
  inlet.name = "tubes";
  inlet.rotation.z = Math.PI / 2;
  inlet.position.set(0, 2.2, 0);

  const outlet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 1.5, 32),
    new THREE.MeshStandardMaterial({ color: BASE_COLORS.tubes, metalness: 0.85, roughness: 0.32 }),
  );
  outlet.name = "tubes";
  outlet.rotation.x = Math.PI / 2;
  outlet.position.set(0, -1.1, 0.15);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.09, 16, 48),
    new THREE.MeshStandardMaterial({
      color: BASE_COLORS.ring,
      metalness: 0.3,
      roughness: 0.35,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.35,
    }),
  );
  ring.name = "ring";
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.6, 0.52);

  const group = new THREE.Group();
  group.add(body, inlet, outlet, ring);
  return group;
}

function baseColorFor(mesh: THREE.Mesh): number {
  const name = mesh.name;
  if (name && name in BASE_COLORS) return BASE_COLORS[name];
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhongMaterial) {
    return mat.color.getHex();
  }
  return 0x8a97a6;
}

function splitGeometryIntoZones(
  geometry: THREE.BufferGeometry,
  zones: typeof MODEL_ZONES,
  axis: Axis,
  axisMin: number,
  axisRange: number,
): { id: string; geometry: THREE.BufferGeometry }[] {
  const pos = geometry.getAttribute("position");
  if (!pos) return [];

  const index = geometry.index;
  const triCount = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);
  if (triCount === 0) return [];

  const coord = (idx: number) =>
    axis === "x" ? pos.getX(idx) : axis === "y" ? pos.getY(idx) : pos.getZ(idx);

  const buckets = new Map<string, number[]>();
  for (let i = 0; i < triCount; i++) {
    const a = index ? index.getX(i * 3) : i * 3;
    const b = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const c = index ? index.getX(i * 3 + 2) : i * 3 + 2;
    const cCoord = (coord(a) + coord(b) + coord(c)) / 3;
    const zone = zoneForCoord(cCoord, axisMin, axisRange, zones);
    if (!buckets.has(zone)) buckets.set(zone, []);
    buckets.get(zone)!.push(a, b, c);
  }

  return zones
    .filter((z) => buckets.has(z.id))
    .map((z) => {
      const indices = buckets.get(z.id)!;
      const sub = new THREE.BufferGeometry();
      sub.setAttribute("position", pos.clone());
      if (geometry.getAttribute("normal"))
        sub.setAttribute("normal", geometry.getAttribute("normal").clone());
      if (geometry.getAttribute("uv")) sub.setAttribute("uv", geometry.getAttribute("uv").clone());
      const idx = new Uint32Array(indices);
      sub.setIndex(new THREE.BufferAttribute(idx, 1));
      sub.computeVertexNormals();
      return { id: z.id, geometry: sub };
    });
}

function applyHighlightsToZone(material: THREE.MeshStandardMaterial, color: string | undefined) {
  if (!color) {
    material.color.setHex(0x4fd1c5);
    material.emissive.setHex(0x14b8a6);
    material.emissiveIntensity = 0.12;
    return;
  }
  material.color.set(color);
  material.emissive.set(color);
  material.emissiveIntensity = 0.45;
}

export function ModelViewer({
  modelUrl = DEFAULT_MODEL_URL,
  highlights,
  legend,
  className,
}: {
  modelUrl?: string;
  highlights?: Record<string, string>;
  legend?: { zone: string; label: string }[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const zoneMaterialsRef = useRef<Record<string, THREE.MeshStandardMaterial[]>>({});
  const autoRotateRef = useRef(true);
  const highlightsRef = useRef(highlights);

  const [status, setStatus] = useState<"loading" | "ready" | "fallback" | "error">("loading");
  const [autoRotate, setAutoRotate] = useState(true);
  const { resetPatientVitals } = useAppStore();

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    highlightsRef.current = highlights;
    const materials = zoneMaterialsRef.current;
    for (const zone of MODEL_ZONES) {
      const mats = materials[zone.id];
      if (!mats) continue;
      for (const m of mats) applyHighlightsToZone(m, highlights?.[zone.id]);
    }
  }, [highlights]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x0c0f17, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f17);
    scene.fog = new THREE.Fog(0x0c0f17, 9, 20);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100,
    );
    camera.position.set(4.6, 3.2, 5.6);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI * 0.92;
    controlsRef.current = controls;

    const hemi = new THREE.HemisphereLight(0xdff6ff, 0x0a0e16, 1.1);
    const key = new THREE.DirectionalLight(0xbfeef5, 2.4);
    key.position.set(4, 6, 3);
    const rim = new THREE.DirectionalLight(0x8b5cf6, 1.4);
    rim.position.set(-5, 2, -4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-2, 1, 5);
    scene.add(hemi, key, rim, fill);

    const grid = new THREE.GridHelper(12, 24, 0x1c2f33, 0x17202b);
    grid.position.y = -1.6;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    scene.add(grid);

    const disposeModel = (group: THREE.Group | null) => {
      if (!group) return;
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });
      scene.remove(group);
    };

    const meshifyZones = (obj: THREE.Group) => {
      zoneMaterialsRef.current = {};
      const meshes: THREE.Mesh[] = [];
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) meshes.push(child);
      });

      if (meshes.length === 0) return;

      const whole = new Box3().setFromObject(obj);
      const size = whole.getSize(new Vector3());
      const axis: Axis = size.x >= size.y && size.x >= size.z ? "x" : size.y >= size.z ? "y" : "z";
      const axisMin = whole.min[axis];
      const axisRange = Math.max(0.0001, whole.max[axis] - whole.min[axis]);

      const zoneIdForMesh = (mesh: THREE.Mesh) => {
        const g = mesh.geometry;
        g.computeBoundingBox();
        const bb = g.boundingBox;
        if (!bb) return MODEL_ZONES[MODEL_ZONES.length - 1].id;
        const c =
          axis === "x"
            ? (bb.min.x + bb.max.x) / 2
            : axis === "y"
              ? (bb.min.y + bb.max.y) / 2
              : (bb.min.z + bb.max.z) / 2;
        return zoneForCoord(c, axisMin, axisRange, MODEL_ZONES);
      };

      for (const mesh of meshes) {
        const parent = mesh.parent;
        if (!parent) continue;
        const zones = splitGeometryIntoZones(mesh.geometry, MODEL_ZONES, axis, axisMin, axisRange);
        if (zones.length <= 1) {
          const mat = new THREE.MeshStandardMaterial({
            color: baseColorFor(mesh),
            metalness: 0.45,
            roughness: 0.25,
            emissive: 0x14b8a6,
            emissiveIntensity: 0.1,
          });
          mesh.material = mat;
          const zid = zoneIdForMesh(mesh);
          if (!zoneMaterialsRef.current[zid]) zoneMaterialsRef.current[zid] = [];
          zoneMaterialsRef.current[zid].push(mat);
          continue;
        }
        const oldMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const oldColor = baseColorFor(mesh);
        const baseEmissive =
          oldMat instanceof THREE.MeshStandardMaterial
            ? oldMat.emissive.clone()
            : new THREE.Color(0x14b8a6);
        for (const zone of zones) {
          const zoneMat = new THREE.MeshStandardMaterial({
            color: oldColor,
            metalness: 0.45,
            roughness: 0.25,
            emissive: baseEmissive,
            emissiveIntensity: 0.1,
          });
          const zoneMesh = new THREE.Mesh(zone.geometry, zoneMat);
          zoneMesh.name = `${mesh.name || "part"}:${zone.id}`;
          zoneMesh.position.copy(mesh.position);
          zoneMesh.rotation.copy(mesh.rotation);
          zoneMesh.scale.copy(mesh.scale);
          zoneMesh.castShadow = mesh.castShadow;
          zoneMesh.receiveShadow = mesh.receiveShadow;
          parent.add(zoneMesh);
          if (!zoneMaterialsRef.current[zone.id]) zoneMaterialsRef.current[zone.id] = [];
          zoneMaterialsRef.current[zone.id].push(zoneMat);
        }
        parent.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material.dispose();
      }

      const highlights = highlightsRef.current;
      for (const zone of MODEL_ZONES) {
        const mats = zoneMaterialsRef.current[zone.id];
        if (!mats) continue;
        for (const m of mats) applyHighlightsToZone(m, highlights?.[zone.id]);
      }
    };

    const placeModel = (group: THREE.Group) => {
      disposeModel(modelGroupRef.current);
      const box = new Box3().setFromObject(group);
      const size = box.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.4 / Math.max(0.001, maxDim);
      group.scale.setScalar(scale);
      box.setFromObject(group);
      const center = box.getCenter(new Vector3());
      group.position.set(-center.x, -center.y - 1.4, -center.z);
      meshifyZones(group);
      scene.add(group);
      modelGroupRef.current = group;
    };

    const loadObj = (url: string) => {
      setStatus("loading");
      new OBJLoader().load(
        url,
        (obj) => {
          placeModel(obj);
          setStatus("ready");
        },
        undefined,
        () => {
          placeModel(buildHeartModel());
          setStatus("fallback");
        },
      );
    };

    loadObj(modelUrl);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.autoRotate = autoRotateRef.current;
      controls.autoRotateSpeed = 1.4;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    container.appendChild(renderer.domElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposeModel(modelGroupRef.current);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container)
        container.removeChild(renderer.domElement);
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      modelGroupRef.current = null;
      zoneMaterialsRef.current = {};
    };
  }, [modelUrl]);

  const resetView = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      camera.position.set(4.6, 3.2, 5.6);
      controls.target.set(0, 0, 0);
      controls.update();
    }
    resetPatientVitals();
  }, [resetPatientVitals]);

  const activeLegend = legend ?? MODEL_ZONES.map((z) => ({ zone: z.id, label: z.label }));

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-hairline bg-[#0c0f17] shadow-panel",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_30%,rgba(79,209,197,0.10),transparent_70%)]" />

      <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5">
        <button
          onClick={resetView}
          className="flex h-8 items-center gap-1.5 rounded-md border border-hairline bg-panel-raised/60 px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
            autoRotate
              ? "border-signal/40 bg-signal/10 text-signal"
              : "border-hairline bg-panel-raised/60 text-ink-muted hover:text-ink",
          )}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", autoRotate && "animate-pulse")} />
          Rotate
        </button>
      </div>

      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0c0f17]/70 backdrop-blur-[2px]">
          <Loader2 className="h-6 w-6 animate-spin text-signal" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            Loading .obj model
          </p>
        </div>
      )}

      {status === "fallback" && (
        <div className="absolute bottom-3.5 left-1/2 z-10 flex w-max max-w-[90%] -translate-x-1/2 items-center gap-2 rounded-md border border-amber/30 bg-[#14101c]/90 px-3 py-2 backdrop-blur-sm">
          <Box className="h-3.5 w-3.5 shrink-0 text-amber" />
          <p className="text-[11px] text-ink-muted">
            No model file served — showing placeholder geometry.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0c0f17]/80">
          <AlertTriangle className="h-6 w-6 text-critical" />
          <p className="text-xs text-ink-muted">3D view unavailable on this device.</p>
        </div>
      )}

      {status === "ready" && legend && (
        <div className="absolute bottom-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 rounded-md border border-hairline bg-panel-raised/70 px-2.5 py-2 backdrop-blur-sm">
          {activeLegend.map((l) => {
            const color = highlights?.[l.zone] ?? "#4FD1C5";
            return (
              <span
                key={l.zone}
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted"
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm border border-hairline-bright/50"
                  style={{ backgroundColor: color }}
                />
                {l.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3.5 right-3.5 z-10 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint/70">
        drag to orbit · scroll to zoom
      </div>
    </div>
  );
}
