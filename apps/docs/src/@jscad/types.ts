import type { Geom3 } from "@jscad/modeling/src/geometries/types";

export type JscadModel = Geom3 | Geom3[] | (Geom3 | Geom3[])[];
