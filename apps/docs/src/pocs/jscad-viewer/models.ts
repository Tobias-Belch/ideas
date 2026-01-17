import modeling from "@jscad/modeling";
const {
  colors: { colorize },
  booleans: { subtract },
  primitives: { cube, cylinder, sphere },
  transforms: { translate },
} = modeling;

import { type JscadModel } from "@/src/jscad/types";

interface RingModelProps {
  r1?: number;
  r2?: number;
  h?: number;
}

export function RingModel({
  r1 = 20,
  r2 = 25,
  h = 5,
}: RingModelProps): JscadModel {
  const outer = cylinder({ height: h, radius: r2, segments: 80 });
  const inner = cylinder({ height: h + 1, radius: r1, segments: 80 });
  const geom = colorize([1, 0, 0, 0.5], subtract(outer, inner));

  return geom;
}

export function MultiGeomModel(): JscadModel {
  const c = colorize([1, 0, 0, 0.5], cube({ size: 20 }));

  const s = colorize(
    [0, 1, 0, 1],
    translate([10, 0, 0], sphere({ radius: 12 }))
  );

  return [c, s];
}
