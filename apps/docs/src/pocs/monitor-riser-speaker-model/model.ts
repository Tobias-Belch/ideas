import modeling from "@jscad/modeling";
import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { type JscadModel } from "@jscad/types";
import { toMm, type NumberWithUnit } from "./values";

const {
  colors: { colorize },
  booleans: { subtract, union },
  primitives: { cuboid, cylinder, sphere },
  transforms: { translate },
} = modeling;

type Props = {
  depth: NumberWithUnit;
  height: NumberWithUnit;
  width: NumberWithUnit;
  enclosureBoardThickness: NumberWithUnit;
};

export function MonitorRiserSpeakerModel(speaker: Props): JscadModel {
  const w = normaliseUnits(speaker.width);
  const h = normaliseUnits(speaker.height);
  const d = normaliseUnits(speaker.depth);
  const t = normaliseUnits(speaker.enclosureBoardThickness);

  // Create each panel
  const front = EnclosurePanel([w, h, t]);
  const back = EnclosurePanel([w, h, t]);
  const left = EnclosurePanel([t, h - 2 * t, d - 2 * t]);
  const right = EnclosurePanel([t, h - 2 * t, d - 2 * t]);
  const top = EnclosurePanel([w, t, d - 2 * t]);
  const bottom = EnclosurePanel([w, t, d - 2 * t]);

  // Position each panel
  const frontTranslated = translate([0, 0, -d / 2 + t / 2], front);
  const backTranslated = translate([0, 0, d / 2 - t / 2], back);
  const leftTranslated = translate([-w / 2 + t / 2, 0, 0], left);
  const rightTranslated = translate([w / 2 - t / 2, 0, 0], right);
  const topTranslated = translate([0, h / 2 - t / 2, 0], top);
  const bottomTranslated = translate([0, -h / 2 + t / 2, 0], bottom);

  // Union all panels together
  const geom = [
    frontTranslated,
    backTranslated,
    leftTranslated,
    rightTranslated,
    topTranslated,
    bottomTranslated,
  ];

  return geom;
}

function EnclosurePanel(size: Vec3) {
  return colorize([0.6, 0.3, 0.1, 0.5], cuboid({ size }));
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}

function normaliseSize(
  width: NumberWithUnit,
  height: NumberWithUnit,
  depth: NumberWithUnit,
): Vec3 {
  return [normaliseUnits(width), normaliseUnits(height), normaliseUnits(depth)];
}
