import modeling from "@jscad/modeling";
import { materials } from "./materials";
import { mm, type NumberWithUnit } from "../values";
import { normaliseUnits } from "./utils";

const {
  colors: { colorize },
  primitives: { cylinder },
} = modeling;

export function HeadphoneJack({
  diameter = mm(2 * 3.5),
}: { diameter?: NumberWithUnit } = {}) {
  const normalisedDiameter = normaliseUnits(diameter);
  const headphoneJackDepth = 1;

  const radius = normalisedDiameter / 2;
  const jack = colorize(
    [...materials.Hole.color, 1],
    cylinder({
      height: headphoneJackDepth + 0.2,
      radius: radius,
      segments: 32,
    }),
  );

  const ringRadius = radius * 1.23;
  const ring = colorize(
    [...materials.Gold.color, 1],
    cylinder({
      height: headphoneJackDepth,
      radius: ringRadius,
      segments: 32,
    }),
  );

  return [ring, jack];
}
