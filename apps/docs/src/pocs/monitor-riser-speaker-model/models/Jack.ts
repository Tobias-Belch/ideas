import modeling from "@jscad/modeling";
import { materials } from "./materials";
import { mm, type NumberWithUnit } from "../values";
import { normaliseUnits } from "./utils";
import type { Material } from "@jscad/types";

const {
  colors: { colorize },
  primitives: { cylinder },
} = modeling;

export function Jack({
  diameter = mm(2 * 3.5),
  material = materials.Gold,
}: { diameter?: NumberWithUnit; material?: Material } = {}) {
  const normalisedDiameter = normaliseUnits(diameter);
  const depth = 1;

  const radius = normalisedDiameter / 2;
  const jack = colorize(
    [...materials.Hole.color, 1],
    cylinder({
      height: depth + 0.2,
      radius: radius,
      segments: 32,
    }),
  );

  const ringRadius = radius * 1.23;
  const ring = colorize(
    [...material.color],
    cylinder({
      height: depth,
      radius: ringRadius,
      segments: 32,
    }),
  );

  return [ring, jack];
}
