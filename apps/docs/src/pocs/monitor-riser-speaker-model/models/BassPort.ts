import modeling from "@jscad/modeling";
import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { materials } from "./materials";
import { move, normaliseUnits } from "./utils";
import type { NumberWithUnit } from "../values";

const {
  colors: { colorize },
  primitives: { cylinder },
  transforms: { translate },
} = modeling;

export function BassPort({
  depth,
  diameter,
}: {
  diameter: NumberWithUnit;
  depth: NumberWithUnit;
}) {
  const normalised = {
    depth: normaliseUnits(depth),
    diameter: normaliseUnits(diameter),
  };

  return colorize(
    [...materials.Hole.color, 1],
    cylinder({
      height: normalised.depth,
      radius: normalised.diameter / 2,
      segments: 32,
    }),
  );
}
