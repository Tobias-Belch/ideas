import * as THREE from "three";
import type { Geom3 } from "@jscad/modeling/src/geometries/types";

export type JscadModel = Geom3 | Geom3[] | (Geom3 | Geom3[])[];

export type Outline = THREE.Color | { color: THREE.Color; opacity: number };
