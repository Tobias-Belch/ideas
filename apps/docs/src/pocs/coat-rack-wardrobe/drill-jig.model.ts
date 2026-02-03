import modeling from "@jscad/modeling";
import { cm, mm, toMm, type NumberWithUnit } from "../values";
import type { CalculatedDimensions } from "./types";

const {
  booleans: { subtract },
  colors: { colorize },
  primitives: { cuboid },
  transforms: { translate },
} = modeling;

const margin = normaliseUnits(mm(0.5));
const max = { width: cm(18), height: cm(18), depth: cm(18) };
const thickness = cm(1);

export function DrillJig({
  dimensions,
}: {
  dimensions: Pick<CalculatedDimensions, "wallMount" | "bottomRail">;
}) {
  const normalised = {
    wallMount: {
      width: normaliseUnits(dimensions.wallMount.width) + margin,
      height: normaliseUnits(dimensions.wallMount.height) + margin,
      depth: normaliseUnits(dimensions.wallMount.depth) + margin,
    },
    bottomRail: {
      width: normaliseUnits(dimensions.bottomRail.width) + margin,
      height: normaliseUnits(dimensions.bottomRail.height) + margin,
      depth: normaliseUnits(dimensions.bottomRail.depth) + margin,
    },
    thickness: normaliseUnits(thickness),
    margin: margin,
    max: {
      width: normaliseUnits(max.width),
      height: normaliseUnits(max.height),
      depth: normaliseUnits(max.depth),
    },
  };

  const wallMount = Cuboid({
    size: [
      normalised.wallMount.width,
      normalised.wallMount.height,
      normalised.wallMount.depth,
    ],
  });

  const bottomRail = Cuboid({
    size: [
      normalised.bottomRail.width,
      normalised.bottomRail.height,
      normalised.bottomRail.depth,
    ],
  });

  const shell = subtract(
    Cuboid({
      size: [
        Math.min(
          2 * normalised.thickness +
            normalised.wallMount.width +
            normalised.bottomRail.width +
            normalised.margin,
          normalised.max.width,
        ),
        Math.min(
          2 * normalised.thickness +
            normalised.wallMount.height +
            normalised.margin,
          normalised.max.height,
        ),
        Math.min(
          2 * normalised.thickness +
            normalised.wallMount.depth +
            normalised.margin,
          normalised.max.depth,
        ),
      ],
    }),
    translate(
      [normalised.thickness, normalised.thickness, normalised.thickness],
      [wallMount, translate([normalised.wallMount.width, 0, 0], bottomRail)],
    ),
  );

  const jig = shell;

  return colorize([1, 0.7, 0.5, 0.7], jig);
}

function Cuboid({ size }: { size: [number, number, number] }) {
  return cuboid({
    size,
    center: size.map((s) => s / 2) as [number, number, number],
  });
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}
