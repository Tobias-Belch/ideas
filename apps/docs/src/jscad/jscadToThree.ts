import * as THREE from "three";
import type { Mat4 } from "@jscad/modeling/src/maths/types";
import type { Geom3 } from "@jscad/modeling/src/geometries/types";
import type { JscadModel } from "./types";

// ----------
// HELPERS
// ----------

function flattenGeoms(input: JscadModel): Geom3[] {
  const result: Geom3[] = [];

  const recurse = (item: any) => {
    if (!item) return;

    if (Array.isArray(item)) {
      for (const sub of item) recurse(sub);
    } else if (item.polygons) {
      result.push(item);
    } else {
      console.warn("Unknown JSCAD geometry type:", item);
    }
  };

  recurse(input);
  return result;
}

function extractColor(g: any): [number, number, number, number] | undefined {
  if (g.color) return g.color;
  if (g.transforms?.color) return g.transforms.color;
  if (g._color) return g._color;
  return undefined;
}

// ----------
// MAIN GROUP CONVERTER
// ----------

export function jscadToThree(input: JscadModel): THREE.Group {
  const group = new THREE.Group();
  const geoms = flattenGeoms(input);

  for (const geom of geoms) {
    const color = extractColor(geom) ?? [0.8, 0.8, 0.8, 1]; // default is light gray
    const mesh = convertToMesh(geom, color);
    if (mesh) group.add(mesh);
  }

  return group;
}

// ----------
// SINGLE GEOMETRY -> MESH
// ----------

function convertToMesh(
  geom: Geom3,
  color: [number, number, number, number]
): THREE.Mesh | null {
  if (geom.polygons.length === 0) return null;

  const positions: number[] = [];
  const normals: number[] = [];

  for (const poly of geom.polygons) {
    const verts = poly.vertices;

    // fan triangulation (JSCAD polygons may be >3 vertices)
    for (let i = 1; i < verts.length - 1; i++) {
      const a = verts[0];
      const b = verts[i];
      const c = verts[i + 1];

      positions.push(...a, ...b, ...c);

      const vA = new THREE.Vector3(...a);
      const vB = new THREE.Vector3(...b);
      const vC = new THREE.Vector3(...c);

      const normal = new THREE.Vector3()
        .subVectors(vB, vA)
        .cross(new THREE.Vector3().subVectors(vC, vA))
        .normalize();

      normals.push(
        ...normal.toArray(),
        ...normal.toArray(),
        ...normal.toArray()
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingSphere();

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color[0], color[1], color[2]),
    opacity: color[3],
    transparent: color[3] < 1,
    metalness: 0.1,
    roughness: 0.5,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Apply JSCAD transform matrix if present
  if (geom.transforms && Array.isArray(geom.transforms)) {
    const m = new THREE.Matrix4();
    m.fromArray(geom.transforms as Mat4);
    mesh.applyMatrix4(m);
  }

  return mesh;
}
