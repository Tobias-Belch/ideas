import modeling from "@jscad/modeling";
import { materials } from "./materials";
import { mm, type NumberWithUnit } from "../values";
import { normaliseUnits } from "./utils";

const {
  colors: { colorize },
  primitives: { cuboid },
  transforms: { translate },
} = modeling;

export function VolumeKnob({
  diameter = mm(8),
}: { diameter?: NumberWithUnit } = {}) {
  const normalisedDiameter = normaliseUnits(diameter);
  const radius = normalisedDiameter / 2;
  const length = normalisedDiameter * 1.5;

  const knob = colorize(
    [...materials.Control.color, 1],
    modeling.primitives.cylinderElliptic({
      height: length,
      startRadius: [radius, radius],
      endRadius: [radius * 0.9, radius * 0.9],
      segments: 64,
    }),
  );

  const indicatorLine = translate(
    [0, radius / 2 - radius / 4, length / 2],
    colorize(
      [1, 1, 1, 1],
      cuboid({
        size: [radius * 0.1, radius * 0.5, 0.1],
      }),
    ),
  );

  return [knob, indicatorLine];
}
