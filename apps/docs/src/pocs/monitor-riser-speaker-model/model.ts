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
  driver:
    | NumberWithUnit
    | {
        tweeter: NumberWithUnit;
        woofer: NumberWithUnit;
      };
  bassPort: NumberWithUnit;
};

export function MonitorRiserSpeakerModel(speaker: Props): JscadModel {
  const width = normaliseUnits(speaker.width);
  const height = normaliseUnits(speaker.height);
  const depth = normaliseUnits(speaker.depth);
  const enclosureBoardThickness = normaliseUnits(
    speaker.enclosureBoardThickness,
  );

  const driverDiameter =
    "value" in speaker.driver
      ? normaliseUnits(speaker.driver)
      : {
          tweeter: normaliseUnits(speaker.driver.tweeter),
          woofer: normaliseUnits(speaker.driver.woofer),
        };

  return [
    Enclosure([width, height, depth], enclosureBoardThickness),
    VerticalSupport([width, height, depth], enclosureBoardThickness),
    ...Drivers(driverDiameter, {
      size: [width, height, depth],
      boardThickness: enclosureBoardThickness,
    }),
    BassPort({
      diameter: normaliseUnits(speaker.bassPort),
      speaker: {
        size: [width, height, depth],
        boardThickness: enclosureBoardThickness,
      },
    }),
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

/**
 * Drivers
 * -------
 * Either a single driver (full range) or dual drivers (woofer + tweeter).
 * The full range or woofer driver is centered horizontally and vertically.
 * The tweeter is positioned above and to the right of the woofer.
 */
function Drivers(
  diameter: number | { tweeter: number; woofer: number },
  speaker: { size: Vec3; boardThickness: number },
) {
  if (typeof diameter === "number") {
    return [Driver({ diameter, speaker })];
  }

  const drivers = [
    Driver({ diameter: diameter.woofer, speaker }),
    translate(
      move(
        {
          position: "top-right",
          gap: diameter.tweeter / 4,
          size: [diameter.tweeter, diameter.tweeter, 0],
        },
        speaker,
      ),
      Driver({ diameter: diameter.tweeter, speaker }),
    ),
  ];

  return drivers;
}

function Driver({
  diameter,
  speaker: {
    size: [, , depth],
    boardThickness,
  },
}: {
  diameter: number;
  speaker: { size: Vec3; boardThickness: number };
}) {
  const radius = diameter / 2;
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
      [...materials.Metal.color, 1],
      cylinder({ height: magnetHeight, radius: magnetRadius, segments: 32 }),
    ),
  );

  // Assemble driver: frame at z=0, cone on top, dust cap on cone, magnet behind
  return translate(
    [0, 0, depth / 2 + boardThickness / 2],
    [
      colorize([...materials.Metal.color, 1], frame),
      colorize(
        [0.1, 0.1, 0.1, 1],
        translate([0, 0, frameHeight - coneHeight], cone),
      ),
      colorize([0.2, 0.2, 0.2, 1], dustCap),
      magnet,
    ],
  );
}

function BassPort({
  diameter,
  speaker: {
    size: [width, height, depth],
    boardThickness,
  },
}: {
  diameter: number;
  speaker: { size: Vec3; boardThickness: number };
}) {
  const radius = diameter / 2;

  const topLeftPosition = move(
    {
      position: "top-left",
      z: depth / 2,
      gap: diameter / 4,
      size: [diameter, diameter, boardThickness + 2],
    },
    {
      size: [width, height, depth],
      boardThickness,
    },
  );

  return translate(
    topLeftPosition,
    colorize(
      [...materials.Plastic.color, 1],
      cylinder({
        height: boardThickness + 2,
        radius,
        segments: 32,
      }),
    ),
  );
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}

function move(
  geometry: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    gap: number;
    size: Vec3;
    z?: number;
  },
  speaker: { size: Vec3; boardThickness: number },
): [number, number, number] {
  const x = geometry.position.includes("left")
    ? -speaker.size[0] / 2 +
      speaker.boardThickness +
      geometry.size[0] / 2 +
      geometry.gap
    : speaker.size[0] / 2 -
      speaker.boardThickness -
      geometry.size[0] / 2 -
      geometry.gap;

  const y = geometry.position.includes("top")
    ? speaker.size[1] / 2 -
      speaker.boardThickness -
      geometry.size[1] / 2 -
      geometry.gap
    : -speaker.size[1] / 2 +
      speaker.boardThickness +
      geometry.size[1] / 2 +
      geometry.gap;

  return [x, y, geometry.z ?? 0];
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
    outline: [1, 1, 1, 0.5],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xa0522d, // warmer, more wood-like brown
      specular: 0x222111, // subtle, warm specular
      shininess: 8, // lower shininess for a matte look
    },
  },
  Plastic: {
    id: materialId([0.1, 0.1, 0.1]),
    color: [0.1, 0.1, 0.1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0x1a1a1a,
      specular: 0x333333,
      shininess: 50,
    },
  },
} as const satisfies Materials;
