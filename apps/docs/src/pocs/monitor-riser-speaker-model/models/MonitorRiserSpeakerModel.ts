import modeling from "@jscad/modeling";
import type { Vec3 } from "@jscad/modeling/src/maths/types";
import { type JscadModel } from "@jscad/types";
import { mm, type NumberWithUnit } from "../../values";
import { materials } from "./materials";
import { move, normaliseUnits } from "./utils";
import { Jack } from "./Jack";
import { VolumeKnob } from "./VolumeKnob";
import { Led } from "./Led";
import { Driver } from "./Driver";
import { BassPort } from "./BassPort";

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
  braceWindowPct: number;
  driver:
    | NumberWithUnit
    | {
        tweeter: NumberWithUnit;
        woofer: NumberWithUnit;
      };
  bassPort: NumberWithUnit;
  volumeKnob: NumberWithUnit;
};

export function MonitorRiserSpeakerModel(speaker: Props): JscadModel {
  const width = normaliseUnits(speaker.width);
  const height = normaliseUnits(speaker.height);
  const depth = normaliseUnits(speaker.depth);
  const enclosureBoardThickness = normaliseUnits(
    speaker.enclosureBoardThickness,
  );

  const normalisedSpeaker: { size: Vec3; boardThickness: number } = {
    size: [width, height, depth],
    boardThickness: enclosureBoardThickness,
  };

  return [
    Enclosure({
      speaker: {
        ...normalisedSpeaker,
        bassPort: speaker.bassPort,
        gx16Port: normaliseUnits(mm(16)),
      },
    }),
    VerticalSupport({
      windowPct: speaker.braceWindowPct,
      speaker: normalisedSpeaker,
    }),
    ...Drivers(speaker.driver, normalisedSpeaker),
    ...Controls({
      speaker: {
        ...normalisedSpeaker,
        headphoneJack: mm(2 * 3.5),
        led: mm(5),
        volumeKnob: speaker.volumeKnob,
      },
    }),
    ...Ports({
      speaker: {
        ...normalisedSpeaker,
        lineInJack: mm(2 * 3.5),
        bananaPort: mm(5),
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
function Enclosure({
  speaker: {
    size: [width, height, depth],
    boardThickness,
    gx16Port,
    ...speaker
  },
}: {
  speaker: {
    size: Vec3;
    boardThickness: number;
    bassPort: NumberWithUnit;
    gx16Port: number;
  };
}) {
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

  const positionBottomCenter = move(
    {
      position: "bottom-center",
      z: -(depth / 2 - boardThickness / 2),
      gap: gx16Port,
      size: [gx16Port, gx16Port, boardThickness + 2],
    },
    { size: [width, height, depth], boardThickness },
  );

  const bassPort = BassPort({
    depth: mm(boardThickness + 2),
    diameter: speaker.bassPort,
  });

  const bassPortPosition = move(
    {
      position: "top-left",
      z: depth / 2,
      gap: normaliseUnits(speaker.bassPort) / 4,
      size: [
        normaliseUnits(speaker.bassPort),
        normaliseUnits(speaker.bassPort),
        boardThickness + 2,
      ],
    },
    {
      size: [width, height, depth],
      boardThickness,
    },
  );

  return [
    colorize(
      [...materials.Wood.color, 0.5],
      subtract(frontTranslated, translate(bassPortPosition, bassPort)),
    ),
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
function VerticalSupport({
  windowPct,
  speaker: {
    size: [width, height],
    boardThickness,
  },
}: {
  windowPct: number;
  speaker: { size: Vec3; boardThickness: number };
}) {
  const w = width;
  const h = height;
  const t = boardThickness;

  // Window cutout: 80% of board size, centered, with rounded corners
  const cutoutWidth = (w - 2 * t) * windowPct;
  const cutoutHeight = (h - 2 * t) * windowPct;
  const cutoutThickness = t + 1; // slightly thicker for subtraction
  const cornerRadius = Math.min(cutoutWidth, cutoutHeight) * 0.08;

  // Create four corner cylinders
  const topLeft = translate(
    [-cutoutWidth / 2 + cornerRadius, cutoutHeight / 2 - cornerRadius, 0],
    modeling.primitives.cylinder({
      height: cutoutThickness,
      radius: cornerRadius,
      segments: 32,
    }),
  );
  const topRight = translate(
    [cutoutWidth / 2 - cornerRadius, cutoutHeight / 2 - cornerRadius, 0],
    modeling.primitives.cylinder({
      height: cutoutThickness,
      radius: cornerRadius,
      segments: 32,
    }),
  );
  const bottomLeft = translate(
    [-cutoutWidth / 2 + cornerRadius, -cutoutHeight / 2 + cornerRadius, 0],
    modeling.primitives.cylinder({
      height: cutoutThickness,
      radius: cornerRadius,
      segments: 32,
    }),
  );
  const bottomRight = translate(
    [cutoutWidth / 2 - cornerRadius, -cutoutHeight / 2 + cornerRadius, 0],
    modeling.primitives.cylinder({
      height: cutoutThickness,
      radius: cornerRadius,
      segments: 32,
    }),
  );

  // Create connecting cuboids
  const horizontal = modeling.primitives.cuboid({
    size: [cutoutWidth - 2 * cornerRadius, cutoutHeight, cutoutThickness],
  });
  const vertical = modeling.primitives.cuboid({
    size: [cutoutWidth, cutoutHeight - 2 * cornerRadius, cutoutThickness],
  });

  // Union all shapes for rounded rectangle
  const cutoutShape = union(
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    horizontal,
    vertical,
  );

  // Subtract cutout from board
  const board = cuboid({ size: [w - 2 * t, h - 2 * t, t] });
  const windowBraced = colorize(
    materials.Wood.color,
    subtract(board, cutoutShape),
  );

  return windowBraced;
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
  diameter:
    | NumberWithUnit
    | { tweeter: NumberWithUnit; woofer: NumberWithUnit },
  speaker: { size: Vec3; boardThickness: number },
) {
  if (
    ((
      diameter:
        | NumberWithUnit
        | { tweeter: NumberWithUnit; woofer: NumberWithUnit },
    ): diameter is NumberWithUnit =>
      "value" in diameter && typeof diameter.value === "number")(diameter)
  ) {
    return [Driver({ diameter })];
  }

  const normalised = {
    tweeter: normaliseUnits(diameter.tweeter),
    woofer: normaliseUnits(diameter.woofer),
  };

  const drivers = [
    Driver({ diameter: diameter.woofer }),
    translate(
      move(
        {
          position: "top-right",
          gap: normalised.tweeter / 4,
          size: [normalised.tweeter, normalised.tweeter, 0],
        },
        speaker,
      ),
      Driver({ diameter: diameter.tweeter }),
    ),
  ];

  return translate(
    [0, 0, speaker.size[2] / 2 + speaker.boardThickness / 2],
    drivers,
  );
}

function Controls({
  speaker: {
    size: [width, height, depth],
    boardThickness,
    ...speaker
  },
}: {
  speaker: {
    size: Vec3;
    boardThickness: number;
    headphoneJack: NumberWithUnit;
    led: NumberWithUnit;
    volumeKnob: NumberWithUnit;
  };
}) {
  const normalised = {
    headphoneJack: normaliseUnits(speaker.headphoneJack),
    led: normaliseUnits(speaker.led),
    volumeKnob: normaliseUnits(speaker.volumeKnob),
  };

  const headphoneJack = Jack({
    diameter: speaker.headphoneJack,
  });

  const led = translate(
    [-3 * normalised.led, 0, -normalised.led / 2],
    Led({
      diameter: speaker.led,
    }),
  );

  const volumeKnob = translate(
    [0, 0, (1.5 * normalised.volumeKnob) / 2 - 0.5],
    VolumeKnob({
      diameter: speaker.volumeKnob,
    }),
  );

  return [
    translate(
      move(
        {
          position: "bottom-center",
          z: depth / 2 + boardThickness / 2,
          gap: normalised.headphoneJack,
          size: [normalised.headphoneJack, normalised.headphoneJack, 1],
        },
        { size: [width, height, depth], boardThickness },
      ),
      headphoneJack,
    ),
    translate(
      move(
        {
          position: "bottom-right",
          z: depth / 2 + boardThickness / 2,
          gap: normalised.headphoneJack,
          size: [
            4 * normalised.led + normalised.volumeKnob,
            normalised.volumeKnob,
            normalised.volumeKnob,
          ],
        },
        { size: [width, height, depth], boardThickness },
      ),
      [led, volumeKnob],
    ),
  ];
}

function Ports({
  speaker: {
    size: [width, height, depth],
    boardThickness,
    ...speaker
  },
}: {
  speaker: {
    size: Vec3;
    boardThickness: number;
    lineInJack: NumberWithUnit;
    bananaPort: NumberWithUnit;
  };
}) {
  const normalised = {
    bananaPort: normaliseUnits(speaker.bananaPort),
    lineInJack: normaliseUnits(speaker.lineInJack),
  };

  const bananaPortRed = translate(
    [-4 * normalised.bananaPort, 0, 0],
    Jack({
      diameter: speaker.bananaPort,
      material: materials.Red,
    }),
  );

  const bananaPortBlack = Jack({
    diameter: speaker.bananaPort,
    material: materials.Black,
  });

  const lineIn = translate(
    [4 * normalised.lineInJack, 0, 0],
    Jack({
      diameter: speaker.lineInJack,
    }),
  );

  const positionBottomCenter = move(
    {
      position: "bottom-center",
      z: -depth / 2 + boardThickness / 2,
      gap: normalised.lineInJack,
      size: [
        6 * normalised.bananaPort + 5 * normalised.lineInJack,
        Math.max(normalised.bananaPort, normalised.lineInJack),
        0,
      ],
    },
    { size: [width, height, depth], boardThickness },
  );

  return translate(positionBottomCenter, [
    bananaPortRed,
    bananaPortBlack,
    lineIn,
  ]);
}
