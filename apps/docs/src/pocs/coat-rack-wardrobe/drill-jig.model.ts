import modeling from "@jscad/modeling";
import { cm, mm, toCm, toMm, type NumberWithUnit } from "../values";
import type { CalculatedDimensions } from "./types";
import { materials } from "./materials";

const {
  booleans: { subtract },
  colors: { colorize },
  primitives: { cuboid, cylinder },
  transforms: { rotateY, translate },
} = modeling;

const DEBUG = false;

const margin = normaliseUnits(mm(0.5));
const thickness = cm(1);
const drillWallThickness = cm(2);
const wallMountHoleOffsetY = cm(2.5);
const bottomRailHolesOffsetZ = cm(3 + toCm(drillWallThickness).value);

const printArea = {
  x: cm(18),
  y: cm(18),
  z: cm(18),
};

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
    drillWallThickness: normaliseUnits(drillWallThickness),
    thickness: normaliseUnits(thickness),
    wallMountHolesOffsetY: normaliseUnits(wallMountHoleOffsetY),
    bottomRailHolesDiameter: normaliseUnits(mm(4)) + margin,
    bottomRailHolesOffsetZ: normaliseUnits(bottomRailHolesOffsetZ),
    margin: margin,
    printArea: {
      x: normaliseUnits(printArea.x),
      y: normaliseUnits(printArea.y),
      z: normaliseUnits(printArea.z),
    },
  };

  normalised.shell.width =
    normalised.thickness +
    normalised.wallMount.width +
    normalised.bottomRail.width +
    normalised.drillWallThickness +
    normalised.margin;
  normalised.shell.height =
    2 * normalised.thickness + normalised.wallMount.height + normalised.margin;
  normalised.shell.depth =
    normalised.drillWallThickness + normalised.wallMount.depth;

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
      [
        normalised.thickness,
        normalised.thickness,
        normalised.drillWallThickness,
      ],
      [wallMount, translate([normalised.wallMount.width, 0, 0], bottomRail)],
    ),
  );

  const wallMountHolesX =
    normalised.thickness +
    (normalised.wallMount.width - (normaliseUnits(mm(6)) + margin)) / 2;

  const wallMountHoles = [
    translate(
      [
        wallMountHolesX,
        normalised.thickness + normalised.wallMountHolesOffsetY,
        -1,
      ],
      ScrewHole("wallMount"),
    ),
    translate(
      [
        wallMountHolesX,
        normalised.wallMount.height -
          normalised.wallMountHolesOffsetY +
          normalised.thickness -
          (normaliseUnits(mm(6)) + margin),
        -1,
      ],
      ScrewHole("wallMount"),
    ),
  ];

  const wallMountHolesSpacers = [
    colorize(
      [1, 0, 0, 0.5],
      translate(
        [normalised.thickness, normalised.thickness, -5],
        [
          Cuboid({
            size: [
              wallMountHolesX - normalised.thickness,
              normalised.wallMount.height,
              30,
            ],
          }),
          translate(
            [
              wallMountHolesX -
                normalised.thickness +
                normaliseUnits(mm(6)) +
                margin,
              0,
              0,
            ],
            Cuboid({
              size: [
                wallMountHolesX - normalised.thickness,
                normalised.wallMount.height,
                30,
              ],
            }),
          ),
        ],
      ),
    ),
    colorize(
      [0, 1, 0, 0.5],
      translate(
        [normalised.thickness, normalised.thickness, -5],
        [
          Cuboid({
            size: [
              normalised.wallMount.width,
              normalised.wallMountHolesOffsetY,
              30,
            ],
          }),
          translate(
            [
              0,
              normalised.wallMount.height - normalised.wallMountHolesOffsetY,
              0,
            ],
            Cuboid({
              size: [
                normalised.wallMount.width,
                normalised.wallMountHolesOffsetY,
                30,
              ],
            }),
          ),
        ],
      ),
    ),
  ];

  const bottomRailHoles = translate(
    [
      normalised.shell.width - normalised.drillWallThickness - 1,
      normalised.thickness +
        (normalised.shell.height -
          normalised.thickness -
          normaliseUnits(mm(4)) -
          margin) /
          2,
      normalised.drillWallThickness,
    ],
    [
      translate(
        [0, 0, normalised.bottomRailHolesOffsetZ],
        ScrewHole("bottomRail"),
      ),
      translate(
        [
          0,
          0,
          normalised.shell.depth -
            normalised.drillWallThickness -
            normalised.bottomRailHolesOffsetZ -
            normaliseUnits(mm(4)) -
            margin,
        ],
        ScrewHole("bottomRail"),
      ),
    ],
  );

  const bottomRailHolesSpacers = [
    colorize(
      [1, 0, 0, 0.5],
      translate(
        [
          normalised.shell.width - normalised.drillWallThickness - 5,
          normalised.thickness,
          normalised.drillWallThickness,
        ],
        [
          Cuboid({
            size: [
              normalised.drillWallThickness + 10,
              normalised.shell.height - normalised.thickness,
              normalised.bottomRailHolesOffsetZ,
            ],
          }),
          translate(
            [
              0,
              0,
              normalised.shell.depth -
                normalised.drillWallThickness -
                normalised.bottomRailHolesOffsetZ,
            ],
            Cuboid({
              size: [
                normalised.drillWallThickness + 10,
                normalised.shell.height - normalised.thickness,
                normalised.bottomRailHolesOffsetZ,
              ],
            }),
          ),
        ],
      ),
    ),
    colorize(
      [0, 1, 0, 0.5],
      translate(
        [
          normalised.shell.width - normalised.drillWallThickness - 5,
          normalised.thickness,
          normalised.drillWallThickness,
        ],
        [
          Cuboid({
            size: [
              normalised.drillWallThickness + 10,
              (normalised.shell.height -
                normalised.thickness -
                normaliseUnits(mm(4)) -
                margin) /
                2,
              normalised.shell.depth - normalised.drillWallThickness,
            ],
          }),
          translate(
            [
              0,
              (normalised.shell.height -
                normalised.thickness +
                normaliseUnits(mm(4)) +
                margin) /
                2,
              0,
            ],
            Cuboid({
              size: [
                normalised.drillWallThickness + 10,
                (normalised.shell.height -
                  normalised.thickness -
                  normaliseUnits(mm(4)) -
                  margin) /
                  2,
                normalised.shell.depth - normalised.drillWallThickness,
              ],
            }),
          ),
        ],
      ),
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

  const printAreaOutline = [
    colorize(
      [
        materials.Obstacle.color[0],
        materials.Obstacle.color[1],
        materials.Obstacle.color[2],
        0.7,
      ],
      [
        translate(
          [0, 0, normalised.printArea.z],
          Cuboid({
            size: [normalised.printArea.x, normalised.printArea.y, 0.5],
          }),
        ),
        translate(
          [normalised.printArea.x, 0, 0],
          Cuboid({
            size: [0.5, normalised.printArea.y, normalised.printArea.z],
          }),
        ),
        translate(
          [0, normalised.printArea.y, 0],
          Cuboid({
            size: [normalised.printArea.x, 0.5, normalised.printArea.z],
          }),
        ),
      ],
    ),
  ];

  return DEBUG
    ? [jig, wallMountHolesSpacers, bottomRailHolesSpacers, printAreaOutline]
    : jig;
}

function Cuboid({ size }: { size: [number, number, number] }) {
  return cuboid({
    size,
    center: size.map((s) => s / 2) as [number, number, number],
  });
}

function ScrewHole(type: "wallMount" | "bottomRail") {
  const height = normaliseUnits(drillWallThickness) + 2;

  if (type === "bottomRail") {
    const radius = (normaliseUnits(mm(4)) + margin) / 2;

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

  const radius = (normaliseUnits(mm(6)) + margin) / 2;

  return translate(
    [radius, radius, height / 2],
    cylinder({
      height,
      radius,
    }),
  );
}

function normaliseUnits(value: NumberWithUnit): number {
  return toMm(value).value; // Convert to scene units (1 scene unit = 1 mm)
}
