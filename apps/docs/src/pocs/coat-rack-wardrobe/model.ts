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
    toCm(dimensions.heatingControl.depth).value + cm(4.5 + 1.6).value,
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
    [0, normaliseUnits(dimensions.bestaBottom.height), 0],
    Board(dimensions.benchBoard),
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

  const beams = [
    translate(
      [
        0,
        normaliseUnits(dimensions.space.height) -
          normaliseUnits(dimensions.beam.height) -
          topGap,
        0,
      ],
      Beam(dimensions.beam),
    ),
  ];

  const topBestaZ = bottomBestaZ;
  const topBestaY =
    normaliseUnits(dimensions.space.height) -
    normaliseUnits(dimensions.bestaTop.height) -
    topGap;

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
    ...beams,
    ...topBestas,
    gapShelfBottom,
    gapShelfTop,
  ];
}

function Beam({
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
    materials.Wood.color,
    cuboid({
      size,
      center: size.map((s) => s / 2) as [number, number, number],
    }),
  );
}

function Board({
  width,
  depth,
  thickness,
}: {
  width: NumberWithUnit;
  depth: NumberWithUnit;
  thickness: NumberWithUnit;
}) {
  const size = [
    normaliseUnits(width),
    normaliseUnits(thickness),
    normaliseUnits(depth),
  ] satisfies [number, number, number];

  return colorize(
    materials.Wood.color,
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
