import modeling from "@jscad/modeling";
import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { materials } from "./materials";
import type { NumberWithUnit } from "../../values";
import { normaliseUnits } from "./utils";

const {
  colors: { colorize },
  booleans: { subtract },
  primitives: { cylinder, sphere },
  transforms: { translate },
} = modeling;

export function Driver({ diameter }: { diameter: NumberWithUnit }) {
  const normalisedDiameter = normaliseUnits(diameter);
  const radius = normalisedDiameter / 2;
  const frameThickness = radius * 0.15;
  const frameHeight = radius * 0.15;
  const coneHeight = radius * 0.25;
  const dustCapRadius = radius * 0.25;
  const dustCapHeight = dustCapRadius * 0.4;
  const magnetRadius = radius * 0.5;
  const magnetHeight = radius * 0.3;

  // Frame ring (outer)
  const frameOuter = cylinder({ height: frameHeight, radius: radius });
  // Frame ring (inner cutout)
  const frameInner = cylinder({
    height: frameHeight + 1,
    radius: radius - frameThickness,
  });
  const frame = subtract(frameOuter, frameInner);

  // Cone (truncated cone)
  const cone = modeling.primitives.cylinderElliptic({
    height: coneHeight,
    startRadius: [dustCapRadius, dustCapRadius],
    endRadius: [radius - frameThickness, radius - frameThickness],
    segments: 64,
  });

  // Dust cap (hemisphere)
  const dustCap = translate(
    [0, 0, frameHeight - coneHeight + dustCapHeight / 2],
    sphere({ radius: dustCapRadius, segments: 32 }),
  );

  // Magnet (cylinder, behind the cone)
  const magnet = translate(
    [0, 0, -magnetHeight / 2],
    colorize(
      [...materials.Gold.color, 1],
      cylinder({ height: magnetHeight, radius: magnetRadius, segments: 32 }),
    ),
  );

  // Assemble driver: frame at z=0, cone on top, dust cap on cone, magnet behind
  /*return translate(
    [0, 0, depth / 2 + boardThickness / 2],
    ,
  );*/

  return [
    colorize([...materials.Gold.color, 1], frame),
    colorize(
      [0.1, 0.1, 0.1, 1],
      translate([0, 0, frameHeight - coneHeight], cone),
    ),
    colorize([0.2, 0.2, 0.2, 1], dustCap),
    magnet,
  ];
}
