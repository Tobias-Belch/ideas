import { cm, toCm } from "../values";
import { type Dimensions, type CalculatedDimensions } from "./types";

let calculated: CalculatedDimensions | null = null;

const alreadyCalculated: (keyof Dimensions)[] = [
  "space",
  "heatingControl",
  "bestaBottom",
  "bestaTop",
  "gapShelfBottom",
  "gapShelfTop",
  "nordli",
];

const numBestaTop = 3;

export function calculateDimensions(
  dimensions: Dimensions,
): CalculatedDimensions {
  if (calculated) return calculated;

  const result: CalculatedDimensions = {} as CalculatedDimensions;

  for (const key of alreadyCalculated) {
    result[key] = dimensions[key] as CalculatedDimensions[typeof key];
  }

  result.benchBoard = {
    width: dimensions.benchBoard.width,
    height: dimensions.benchBoard.thickness,
    depth: dimensions.benchBoard.depth,
  };

  const wallGap = cm(
    toCm(dimensions.gapShelfTop.depth).value -
      toCm(dimensions.bestaTop.depth).value,
  );

  result.wallMount = {
    width: dimensions.wallMount.thickness,
    height: dimensions.wallMount.width,
    depth: wallGap,
  };

  result.bottomRail = {
    width: dimensions.bottomRail.thickness,
    height: cm(
      toCm(dimensions.bestaTop.height).value -
        2 * toCm(dimensions.valance.thickness).value,
    ),
    depth: wallGap,
  };

  result.valance = {
    width: cm(numBestaTop * toCm(dimensions.bestaTop.width).value),
    height: dimensions.valance.thickness,
    depth: wallGap,
  };

  calculated = result;

  return calculated;
}
