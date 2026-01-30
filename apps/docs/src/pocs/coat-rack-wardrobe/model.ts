import modeling from "@jscad/modeling";
import { cm, type NumberWithUnit, toCm } from "../values";
import { materials } from "./materials";
import type { Dimensions } from "./types";

const {
  colors: { colorize },
  primitives: { cuboid },
  transforms: { translate },
} = modeling;

export function CoatRackWardrobe({ dimensions }: { dimensions: Dimensions }) {
  const space = Space(dimensions.space);
  const heatingControl = Obstacle(dimensions.heatingControl);

  const bottomBestaZ = cm(
    toCm(dimensions.gapShelfBottom.depth).value -
      toCm(dimensions.bestaBottom.depth).value,
  );
  const bottomBestas = [
    translate(
      [0, 0, normaliseUnits(bottomBestaZ)],
      Cabinet(dimensions.bestaBottom),
    ),
    translate(
      [
        normaliseUnits(dimensions.bestaBottom.width),
        0,
        normaliseUnits(bottomBestaZ),
      ],
      Cabinet(dimensions.bestaBottom),
    ),
    translate(
      [
        2 * normaliseUnits(dimensions.bestaBottom.width),
        0,
        normaliseUnits(bottomBestaZ),
      ],
      Cabinet(dimensions.bestaBottom),
    ),
  ];

  const benchBoard = translate(
    [
      0,
      normaliseUnits(dimensions.bestaBottom.height),
      normaliseUnits(dimensions.gapShelfBottom.depth) -
        normaliseUnits(dimensions.benchBoard.depth),
    ],
    Board({ ...dimensions.benchBoard, type: "wood" }),
  );

  const nordliRacks = [
    translate(
      [
        10,
        normaliseUnits(dimensions.bestaBottom.height) +
          normaliseUnits(dimensions.benchBoard.thickness),
        normaliseUnits(bottomBestaZ),
      ],
      Cabinet(dimensions.nordli),
    ),
    translate(
      [
        10 + normaliseUnits(dimensions.nordli.width),
        normaliseUnits(dimensions.bestaBottom.height) +
          normaliseUnits(dimensions.benchBoard.thickness),
        normaliseUnits(bottomBestaZ),
      ],
      Cabinet(dimensions.nordli),
    ),
  ];

  const gapShelfBottom = translate(
    [
      normaliseUnits(dimensions.space.width) -
        normaliseUnits(dimensions.gapShelfBottom.width),
      0,
      0,
    ],
    Cabinet(dimensions.gapShelfBottom),
  );

  const topGap =
    normaliseUnits(dimensions.space.height) -
    normaliseUnits(dimensions.gapShelfBottom.height) -
    normaliseUnits(dimensions.gapShelfTop.height);
  const topBestaZ = bottomBestaZ;

  const topBestaY =
    normaliseUnits(dimensions.space.height) -
    normaliseUnits(dimensions.bestaTop.height) -
    topGap;

  const wallMounts = translate(
    [0, topBestaY, 0],
    WallMounts({
      dimensions,
      depth: topBestaZ,
    }),
  );

  const topBestas = [
    translate(
      [0, topBestaY, normaliseUnits(topBestaZ)],
      Cabinet(dimensions.bestaTop),
    ),
    translate(
      [
        normaliseUnits(dimensions.bestaTop.width),
        topBestaY,
        normaliseUnits(topBestaZ),
      ],
      Cabinet(dimensions.bestaTop),
    ),
    translate(
      [
        2 * normaliseUnits(dimensions.bestaTop.width),
        topBestaY,
        normaliseUnits(topBestaZ),
      ],
      Cabinet(dimensions.bestaTop),
    ),
  ];

  const gapShelfTop = translate(
    [
      normaliseUnits(dimensions.space.width) -
        normaliseUnits(dimensions.gapShelfTop.width),
      normaliseUnits(dimensions.space.height) -
        normaliseUnits(dimensions.gapShelfTop.height) -
        topGap,
      0,
    ],
    Cabinet(dimensions.gapShelfTop),
  );

  return [
    space,
    heatingControl,
    ...bottomBestas,
    benchBoard,
    ...nordliRacks,
    wallMounts,
    ...topBestas,
    gapShelfBottom,
    gapShelfTop,
  ];
}

function WallMounts({
  dimensions,
  depth,
}: {
  dimensions: Pick<
    Dimensions,
    "bestaTop" | "wallMount" | "bottomRail" | "valance"
  >;
  depth: NumberWithUnit;
}) {
  const bestaTopWidth = normaliseUnits(dimensions.bestaTop.width);

  const wallMountThickness = normaliseUnits(dimensions.wallMount.thickness);
  const wallMountY =
    normaliseUnits(dimensions.bestaTop.height) -
    normaliseUnits(dimensions.valance.thickness) -
    normaliseUnits(dimensions.wallMount.width);

  const bottomRailHeight = cm(
    toCm(dimensions.bestaTop.height).value -
      2 * toCm(dimensions.valance.thickness).value,
  );
  const bottomRailX = -normaliseUnits(dimensions.bottomRail.thickness);
  const bottomRailY = normaliseUnits(dimensions.valance.thickness);

  const wallMounts = [1, 2, 3, 4, 5, 6].map((_, i) => {
    /** 0: 0 * 60 + 10     = 10
     *  1: 1 * 60 - 10 - 6 = 44
     *  2: 1 * 60 + 10     = 70
     *  3: 2 * 60 - 10 - 6 = 104
     *  4: 2 * 60 + 10     = 130
     *  5: 3 * 60 - 10 - 6 = 164 */
    const x =
      i % 2 === 0
        ? (i / 2) * bestaTopWidth + 10
        : ((i + 1) / 2) * bestaTopWidth - 10 - wallMountThickness;

    return [
      translate(
        [x, wallMountY, 0],
        Board({
          width: dimensions.wallMount.thickness,
          thickness: dimensions.wallMount.width,
          depth,
          type: "wood",
        }),
      ),
      translate(
        [x + bottomRailX, bottomRailY, 0],
        Board({
          width: dimensions.bottomRail.thickness,
          thickness: bottomRailHeight,
          depth,
          type: "wood",
        }),
      ),
    ];
  });

  const vances = [
    translate(
      [
        0,
        normaliseUnits(dimensions.bestaTop.height) -
          normaliseUnits(dimensions.valance.thickness),
        0,
      ],
      Board({
        width: cm(3 * toCm(dimensions.bestaTop.width).value),
        thickness: dimensions.valance.thickness,
        depth,
        type: "cabinet",
      }),
    ),
    Board({
      width: cm(3 * toCm(dimensions.bestaTop.width).value),
      thickness: dimensions.valance.thickness,
      depth,
      type: "cabinet",
    }),
  ];

  return [...wallMounts, ...vances];
}

function Board({
  width,
  depth,
  thickness,
  type = "wood",
}: {
  width: NumberWithUnit;
  depth: NumberWithUnit;
  thickness: NumberWithUnit;
  type: "wood" | "cabinet";
}) {
  const size = [
    normaliseUnits(width),
    normaliseUnits(thickness),
    normaliseUnits(depth),
  ] satisfies [number, number, number];

  return colorize(
    type === "cabinet" ? materials.Cabinet.color : materials.Wood.color,
    cuboid({
      size,
      center: size.map((s) => s / 2) as [number, number, number],
    }),
  );
}

function Cabinet({
  width,
  height,
  depth,
}: {
  width: NumberWithUnit;
  height: NumberWithUnit;
  depth: NumberWithUnit;
}) {
  const size = [
    normaliseUnits(width),
    normaliseUnits(height),
    normaliseUnits(depth),
  ] satisfies [number, number, number];

  return colorize(
    materials.Cabinet.color,
    cuboid({
      size,
      center: size.map((s) => s / 2) as [number, number, number],
    }),
  );
}

function Obstacle({
  width,
  height,
  depth,
}: {
  width: NumberWithUnit;
  height: NumberWithUnit;
  depth: NumberWithUnit;
}) {
  const size = [
    normaliseUnits(width),
    normaliseUnits(height),
    normaliseUnits(depth),
  ] satisfies [number, number, number];

  return colorize(
    materials.Obstacle.color,
    cuboid({
      size,
      center: size.map((s) => s / 2) as [number, number, number],
    }),
  );
}

function Space({
  width,
  height,
  depth,
}: {
  width: NumberWithUnit;
  height: NumberWithUnit;
  depth: NumberWithUnit;
}) {
  const size = [
    normaliseUnits(width),
    normaliseUnits(height),
    normaliseUnits(depth),
  ] satisfies [number, number, number];

  return colorize(
    materials.Space.color,
    cuboid({
      size,
      center: size.map((s) => s / 2) as [number, number, number],
    }),
  );
}

export function normaliseUnits(value: NumberWithUnit): number {
  return toCm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}
