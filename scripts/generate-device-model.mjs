import * as THREE from "three";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/models/medtwin-device.obj");

const heartShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 0.9);
  s.bezierCurveTo(0.9, 0.4, 1.5, 0.9, 1.0, 1.8);
  s.bezierCurveTo(0.65, 2.35, 0.25, 2.2, 0, 1.75);
  s.bezierCurveTo(-0.25, 2.2, -0.65, 2.35, -1.0, 1.8);
  s.bezierCurveTo(-1.5, 0.9, -0.9, 0.4, 0, 0.9);
  return s;
};

const bodyGeo = new THREE.ExtrudeGeometry(heartShape(), {
  depth: 0.8,
  bevelEnabled: true,
  bevelSegments: 8,
  bevelSize: 0.14,
  bevelThickness: 0.18,
});
bodyGeo.rotateX(Math.PI / 2);
bodyGeo.rotateY(Math.PI);
bodyGeo.center();
bodyGeo.translate(0, 0.6, 0);

const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial());
body.name = "body";

const inlet = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.28, 1.7, 32),
  new THREE.MeshStandardMaterial(),
);
inlet.name = "tubes";
inlet.rotation.z = Math.PI / 2;
inlet.position.set(0, 2.2, 0);

const outlet = new THREE.Mesh(
  new THREE.CylinderGeometry(0.24, 0.24, 1.5, 32),
  new THREE.MeshStandardMaterial(),
);
outlet.name = "tubes";
outlet.rotation.x = Math.PI / 2;
outlet.position.set(0, -1.1, 0.15);

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(0.92, 0.09, 16, 48),
  new THREE.MeshStandardMaterial(),
);
ring.name = "ring";
ring.rotation.x = Math.PI / 2;
ring.position.set(0, 0.6, 0.52);

const group = new THREE.Group();
group.add(body, inlet, outlet, ring);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, new OBJExporter().parse(group));
console.log("Wrote", outPath);
