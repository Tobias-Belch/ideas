import modeling from "@jscad/modeling";
import { cm, mm, toMm, type NumberWithUnit } from "../values";
import type { CalculatedDimensions } from "./types";
import { materials } from "./materials";

const {
  booleans: { subtract },
  colors: { colorize },
  primitives: { cuboid, cylinder },
  transforms: { rotate, rotateY, translate },
} = modeling;

const margin = normaliseUnits(mm(0.5));
const max = { width: cm(18), height: cm(18), depth: cm(18) };
const thickness = cm(1);
const wallMountHoleOffsetY = cm(2.5);
const bottomRailHolesOffsetZ = cm(4);

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
    shell: { width: 0, height: 0, depth: 0 },
    thickness: normaliseUnits(thickness),
    wallMountHoleOffsetY: normaliseUnits(wallMountHoleOffsetY),
    bottomRailHolesOffsetZ: normaliseUnits(bottomRailHolesOffsetZ),
    margin: margin,
    max: {
      width: normaliseUnits(max.width),
      height: normaliseUnits(max.height),
      depth: normaliseUnits(max.depth),
    },
  };

  normalised.shell.width = Math.min(
    2 * normalised.thickness +
      normalised.wallMount.width +
      normalised.bottomRail.width +
      normalised.margin,
    normalised.max.width,
  );

  normalised.shell.height = Math.min(
    2 * normalised.thickness + normalised.wallMount.height + normalised.margin,
    normalised.max.height,
  );

  normalised.shell.depth = Math.min(
    2 * normalised.thickness + normalised.wallMount.depth + normalised.margin,
    normalised.max.depth,
  );

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
        normalised.shell.width,
        normalised.shell.height,
        normalised.shell.depth,
      ],
    }),
    translate(
      [normalised.thickness, normalised.thickness, normalised.thickness],
      [wallMount, translate([normalised.wallMount.width, 0, 0], bottomRail)],
    ),
  );

  const wallMountHoles = [
    translate(
      [
        normalised.thickness + normalised.wallMount.width / 2,
        normalised.thickness + normalised.wallMountHoleOffsetY,
        -1,
      ],
      ScrewHole("wallMount"),
    ),
    translate(
      [
        normalised.thickness + normalised.wallMount.width / 2,
        normalised.thickness +
          normalised.wallMount.height -
          normalised.wallMountHoleOffsetY,
        -1,
      ],
      ScrewHole("wallMount"),
    ),
  ];
  const bottomRailHoles = [
    translate(
      [
        normalised.shell.width - normalised.thickness - 1,
        normalised.shell.height / 2,
        normalised.bottomRailHolesOffsetZ + normalised.thickness,
      ],
      ScrewHole("bottomRail"),
    ),
    translate(
      [
        normalised.shell.width - normalised.thickness - 1,
        normalised.shell.height / 2,
        normalised.shell.depth - normalised.bottomRailHolesOffsetZ,
      ],
      ScrewHole("bottomRail"),
    ),
  ];

  const jig = [
    colorize(
      [
        materials.Cabinet.color[0],
        materials.Cabinet.color[1],
        materials.Cabinet.color[2],
        0.7,
      ],
      subtract(shell, wallMountHoles, bottomRailHoles),
    ),
  ];

  return jig;
}

function Cuboid({ size }: { size: [number, number, number] }) {
  return cuboid({
    size,
    center: size.map((s) => s / 2) as [number, number, number],
  });
}

function ScrewHole(type: "wallMount" | "bottomRail") {
  const height = normaliseUnits(thickness) + 2;

  if (type === "bottomRail") {
    const radius = normaliseUnits(mm(4)) / 2;

    return translate(
      [height / 2, radius, radius],
      rotateY(
        Math.PI / 2,
        cylinder({
          height,
          radius,
        }),
      ),
    );
  }

  const radius = normaliseUnits(mm(6)) / 2;

  return translate(
    [height / 2, radius, radius],
    cylinder({
      height,
      radius,
    }),
  );
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}
