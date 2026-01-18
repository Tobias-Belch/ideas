import modeling from "@jscad/modeling";
import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { materialId, type Materials, type JscadModel } from "@jscad/types";
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
  const width = normaliseUnits(speaker.width);
  const height = normaliseUnits(speaker.height);
  const depth = normaliseUnits(speaker.depth);
  const enclosureBoardThickness = normaliseUnits(
    speaker.enclosureBoardThickness,
  );

  return [
    Enclosure([width, height, depth], enclosureBoardThickness),
    VerticalSupport([width, height, depth], enclosureBoardThickness),
  ];
}

/**
 * Enclosure
 * ---------
 * Constructed from 6 wooden panels (front, back, left, right, top, bottom).
 * Each panel is sized to fit together with the thickness of the other panels
 * taken into account. For stability reasons the top panel sits on top of the
 * side panels and back panel, rather than between them. The only compromise
 * to this is that the front panel sits on top of the side, bottom and top panels
 * for esthetic reasons.
 */
function Enclosure([width, height, depth]: Vec3, boardThickness: number) {
  const w = width;
  const h = height;
  const d = depth;
  const t = boardThickness;

  // Create each panel
  const front = WoodenBoard([w, h, t], 0.5);
  const back = WoodenBoard([w - 2 * t, h - 2 * t, t], 0.5);
  const left = WoodenBoard([t, h - 2 * t, d - t], 0.5);
  const right = WoodenBoard([t, h - 2 * t, d - t], 0.5);
  const top = WoodenBoard([w, t, d - t], 0.5);
  const bottom = WoodenBoard([w, t, d - t], 0.5);

  // Position each panel
  const frontTranslated = translate([0, 0, d / 2], front);
  const backTranslated = translate([0, 0, -d / 2 + t], back);
  const leftTranslated = translate([-w / 2 + t / 2, 0, 0], left);
  const rightTranslated = translate([w / 2 - t / 2, 0, 0], right);
  const topTranslated = translate([0, h / 2 - t / 2, 0], top);
  const bottomTranslated = translate([0, -h / 2 + t / 2, 0], bottom);

  return [
    frontTranslated,
    backTranslated,
    leftTranslated,
    rightTranslated,
    topTranslated,
    bottomTranslated,
  ];
}

/**
 * Vertical Support
 * ----------------
 * Sits inside the enclosure, parallel to the front and back panels,
 * is full height and full width minus the thickness of the left and right panels.
 * It connects the top and bottom panels and the left and right panels.
 * It will increase rigidity, prevent parallelogramming of the enclosure
 * under load and support the top panel against bending.
 */
function VerticalSupport([width, height]: Vec3, boardThickness: number) {
  const w = width;
  const h = height;
  const t = boardThickness;

  return WoodenBoard([w - 2 * t, h - 2 * t, t], 1);
}

function WoodenBoard(size: Vec3, opacity = 1) {
  return colorize([...materials.Wood.color, opacity], cuboid({ size }));
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}

export const materials = {
  Metal: {
    id: materialId([0.8, 0.7, 0.5]),
    color: [0.8, 0.7, 0.5],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xccaa88,
      specular: 0xffffff,
      shininess: 80,
    },
  },
  Wood: {
    id: materialId([0.6, 0.3, 0.1]),
    color: [0.6, 0.3, 0.1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xa0522d, // warmer, more wood-like brown
      specular: 0x222111, // subtle, warm specular
      shininess: 8, // lower shininess for a matte look
    },
  },
} as const satisfies Materials;
