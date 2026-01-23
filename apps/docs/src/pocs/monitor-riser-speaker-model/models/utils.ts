import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { toMm, type NumberWithUnit } from "../values";

export function move(
  geometry: {
    position:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
    gap: number;
    size: Vec3;
    z?: number;
  },
  speaker: { size: Vec3; boardThickness: number },
): [number, number, number] {
  const x = (() => {
    switch (true) {
      case geometry.position.includes("left"):
        return (
          -speaker.size[0] / 2 +
          speaker.boardThickness +
          geometry.size[0] / 2 +
          geometry.gap
        );
      case geometry.position.includes("right"):
        return (
          speaker.size[0] / 2 -
          speaker.boardThickness -
          geometry.size[0] / 2 -
          geometry.gap
        );
      case geometry.position.includes("center"):
      default:
        return 0;
    }
  })();

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

export function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}
