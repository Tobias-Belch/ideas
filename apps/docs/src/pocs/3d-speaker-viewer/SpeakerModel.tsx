// SpeakerModel: Option 1 – Full-Range Driver (Simpler)
// This model represents a single 3–4" full-range driver per riser, with no tweeter or crossover.
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Group } from "three";

export const Configurations = {
  "One Fullrange Driver": {
    "Volume Knob": {
      diameter: mm(15),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "knob" as const,
      }),
    },
    "Headphone Jack": {
      diameter: mm(7),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "jack" as const,
      }),
    },
    "Status LED": {
      diameter: mm(10),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "led" as const,
      }),
    },
    "Bass Port": {
      diameter: mm(30),
      position: (dims: EnclosureDimensions) => {
        const portRadiusMm = mm(mm(30).value / 2);
        const controlsRowTopY_mm = mm(-dims.height.value / 2 + 20 + 7.5);
        const portGapAboveControls_mm = mm(10);
        const portCenterY_mm = mm(
          controlsRowTopY_mm.value +
            portGapAboveControls_mm.value +
            portRadiusMm.value
        );
        return {
          x: mm(0),
          y: portCenterY_mm,
          z: mm(dims.depth.value / 2),
          type: "bassPort" as const,
        };
      },
    },
    "Fullrange Driver": {
      diameter: inch(3.6),
      position: (dims: EnclosureDimensions) => {
        const portRadiusMm = mm(mm(30).value / 2);
        const driverRadiusMm = mm(inchToMm(inch(3.6)).value / 2);
        const controlsRowTopY_mm = mm(-dims.height.value / 2 + 20 + 7.5);
        const portGapAboveControls_mm = mm(10);
        const portCenterY_mm = mm(
          controlsRowTopY_mm.value +
            portGapAboveControls_mm.value +
            portRadiusMm.value
        );
        const gapMm = mm(10);
        const driverCenterY_mm = mm(
          portCenterY_mm.value +
            portRadiusMm.value +
            gapMm.value +
            driverRadiusMm.value
        );
        return {
          x: mm(0),
          y: driverCenterY_mm,
          z: mm(dims.depth.value / 2),
          type: "driver" as const,
        };
      },
    },
  },
  "Separate Tweeter & Woofer": {
    "Volume Knob": {
      diameter: mm(15),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "knob" as const,
      }),
    },
    "Headphone Jack": {
      diameter: mm(7),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "jack" as const,
      }),
    },
    "Status LED": {
      diameter: mm(10),
      position: (dims: EnclosureDimensions) => ({
        x: mm(0),
        y: mm(-dims.height.value / 2 + 20),
        z: mm(dims.depth.value / 2),
        type: "led" as const,
      }),
    },
    "Bass Port": {
      diameter: mm(30),
      position: (dims: EnclosureDimensions) => {
        const portRadiusMm = mm(mm(30).value / 2);
        const tweeterRadiusMm = mm(inchToMm(inch(1.1)).value / 2);
        const portTweeterGapMm = mm(10);
        const portAndTweeterTopGapMm = mm(30);
        const portAndTweeterY_mm = mm(
          dims.height.value / 2 - portAndTweeterTopGapMm.value
        );
        const portCenterX_mm = mm(
          -(
            portRadiusMm.value +
            portTweeterGapMm.value / 2 +
            tweeterRadiusMm.value
          )
        );
        return {
          x: portCenterX_mm,
          y: portAndTweeterY_mm,
          z: mm(dims.depth.value / 2),
          type: "bassPort" as const,
        };
      },
    },
    Woofer: {
      diameter: inch(4),
      position: (dims: EnclosureDimensions) => {
        const wooferRadiusMm = mm(inchToMm(inch(4)).value / 2);
        const controlsToWooferGapMm = mm(10);
        const controlsRowTopY_mm = mm(-dims.height.value / 2 + 20 + 7.5);
        const wooferCenterY_mm = mm(
          controlsRowTopY_mm.value +
            controlsToWooferGapMm.value +
            wooferRadiusMm.value
        );
        return {
          x: mm(0),
          y: wooferCenterY_mm,
          z: mm(dims.depth.value / 2),
          type: "driver" as const,
        };
      },
    },
    Tweeter: {
      diameter: inch(1.1),
      position: (dims: EnclosureDimensions) => {
        const tweeterRadiusMm = mm(inchToMm(inch(1.1)).value / 2);
        const portRadiusMm = mm(mm(30).value / 2);
        const portTweeterGapMm = mm(10);
        const portAndTweeterTopGapMm = mm(30);
        const portAndTweeterY_mm = mm(
          dims.height.value / 2 - portAndTweeterTopGapMm.value
        );
        const tweeterCenterX_mm = mm(
          tweeterRadiusMm.value +
            portTweeterGapMm.value / 2 +
            portRadiusMm.value
        );
        return {
          x: tweeterCenterX_mm,
          y: portAndTweeterY_mm,
          z: mm(dims.depth.value / 2),
          type: "driver" as const,
        };
      },
    },
  },
} as const;

export type Configuration = keyof typeof Configurations;

type EnclosureDimensions = {
  width: Milimeters;
  height: Milimeters;
  depth: Milimeters;
};

type Props = {
  width: Milimeters;
  height: Milimeters;
  depth: Milimeters;
  configuration: Configuration;
};

export default function SpeakerModel({
  width,
  height,
  depth,
  configuration,
}: Props) {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Clear any existing children
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    // Dimensions (in mm)
    const WIDTH_MM = width;
    const HEIGHT_MM = height;
    const DEPTH_MM = depth;
    const DEPTH = mmToUnits(DEPTH_MM);

    // Main enclosure box + wireframe
    const enclosureGroup = createEnclosure({
      widthMm: WIDTH_MM,
      heightMm: HEIGHT_MM,
      depthMm: DEPTH_MM,
    });
    groupRef.current.add(enclosureGroup);

    // --- Back Panel ---
    const backPanelGroup = createBackPanel({
      rcaDiameterMm: mm(16),
      rcaDepthMm: mm(15),
      rcaSpacingMm: mm(60),
      powerJackDiameterMm: mm(20),
      powerJackDepthMm: mm(15),
    });
    backPanelGroup.position.z = -DEPTH / 2;
    groupRef.current!.add(backPanelGroup);

    // Internal bracing visualization (semi-transparent)
    const brace = createBrace({
      innerWidthMm: mm(WIDTH_MM.value - 20),
      thicknessMm: mm(15),
      innerDepthMm: mm(DEPTH_MM.value - 40),
    });
    brace.position.y = mmToUnits(mm(-30));
    groupRef.current!.add(brace);

    groupRef.current!.add(
      ...createComponentsFromConfiguration(configuration, {
        width,
        height,
        depth,
      })
    );
  }, []);

  return (
    <group
      ref={groupRef as React.RefObject<THREE.Group>}
      position={[0, 0, 0]}
    />
  );
}

function createComponentsFromConfiguration(
  configuration: Configuration,
  dims: EnclosureDimensions
): THREE.Object3D[] {
  const config = Configurations[configuration];
  const groups: THREE.Object3D[] = [];

  const WIDTH_MM = dims.width;
  const HEIGHT_MM = dims.height;
  const DEPTH_MM = dims.depth;
  const WIDTH = mmToUnits(WIDTH_MM);

  const controlComponents: Array<{
    key: string;
    type: "knob" | "jack" | "led";
  }> = [
    { key: "Volume Knob", type: "knob" },
    { key: "Headphone Jack", type: "jack" },
    { key: "Status LED", type: "led" },
  ];

  // Process each component in the configuration
  const componentEntries = Object.entries(config);

  for (const [compKey, compData] of componentEntries) {
    const positionData = (compData as any).position({
      width: WIDTH_MM,
      height: HEIGHT_MM,
      depth: DEPTH_MM,
    });
    const diameter = (compData as any).diameter;
    const componentType = positionData.type;

    let component: THREE.Object3D;

    // Create the appropriate component based on type
    if (componentType === "knob") {
      component = createKnob({ diameterMm: diameter });
    } else if (componentType === "jack") {
      component = createHeadphoneJack();
    } else if (componentType === "led") {
      component = createLED({ diameterMm: diameter });
    } else if (componentType === "bassPort") {
      component = createBassPort({ diameterMm: diameter });
    } else if (componentType === "driver") {
      // Determine if this is a tweeter (small) or woofer/fullrange (large)
      const diameterInMm = inchToMm(diameter);
      component = createDriver({ outerDiameterMm: diameterInMm });
    } else {
      continue;
    }

    // Handle controls row spacing
    const isControlComponent = controlComponents.some((c) => c.key === compKey);
    if (isControlComponent) {
      // Layout control components evenly across the width
      const controlIndex = controlComponents.findIndex(
        (c) => c.key === compKey
      );
      const controlsCount = controlComponents.length;
      const controlsSpacing = WIDTH / (controlsCount + 1);
      component.position.set(
        -WIDTH / 2 + controlsSpacing * (controlIndex + 1),
        mmToUnits(positionData.y),
        mmToUnits(positionData.z)
      );
    } else {
      // Non-control components use their configured positions directly
      component.position.set(
        mmToUnits(positionData.x),
        mmToUnits(positionData.y),
        mmToUnits(positionData.z)
      );
    }

    groups.push(component);
  }

  return groups;
}

// --- Materials (constants) ---
const ENCLOSURE_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0xa0522d, // warmer, more wood-like brown
  specular: 0x222111, // subtle, warm specular
  shininess: 8, // lower shininess for a matte look
});

const DRIVER_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0x333333,
  specular: 0x222222,
  shininess: 10,
});

const PORT_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0x0d0d0d,
  specular: 0x222222,
  shininess: 5,
});

const METAL_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0xccaa88,
  specular: 0xffffff,
  shininess: 80,
});

const LED_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  emissive: 0x00ff00,
  emissiveIntensity: 0.8,
});

const RCA_RED_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  specular: 0x888888,
  shininess: 30,
});
const RCA_WHITE_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0x888888,
  shininess: 30,
});
const INDICATOR_MATERIAL = new THREE.MeshPhongMaterial({ color: 0xff6600 });
const HOLE_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x000000 });
const BRACE_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0x555555,
  transparent: true,
  opacity: 0.2,
});
const WIREFRAME_MATERIAL = new THREE.LineBasicMaterial({
  color: 0x444444,
  linewidth: 1,
});

function createEnclosure({
  widthMm,
  heightMm,
  depthMm,
}: {
  widthMm: Milimeters;
  heightMm: Milimeters;
  depthMm: Milimeters;
}): THREE.Group {
  const w = mmToUnits(widthMm);
  const h = mmToUnits(heightMm);
  const d = mmToUnits(depthMm);

  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, ENCLOSURE_MATERIAL);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const edges = new THREE.EdgesGeometry(geometry);
  const wireframe = new THREE.LineSegments(edges, WIREFRAME_MATERIAL);
  group.add(wireframe);

  return group;
}

function createDriver({
  outerDiameterMm,
}: {
  outerDiameterMm: Milimeters;
}): THREE.Group {
  const group = new THREE.Group();

  // Cone
  const coneDiameterMm = outerDiameterMm.value * 0.76;
  const coneDepthMm = outerDiameterMm.value * 0.13;
  const coneR = mmToUnits(mm(coneDiameterMm / 2));
  const coneDepth = mmToUnits(mm(coneDepthMm));
  const coneGeometry = new THREE.CylinderGeometry(coneR, coneR, coneDepth, 64);
  const cone = new THREE.Mesh(coneGeometry, DRIVER_MATERIAL);
  cone.rotation.x = Math.PI / 2;
  cone.castShadow = true;
  group.add(cone);

  // Surround ring (faces +Z by default)
  const surroundTubeMm = outerDiameterMm.value * 0.09;
  const surroundTube = mmToUnits(mm(surroundTubeMm));
  const surroundOuterR = mmToUnits(mm(outerDiameterMm.value / 2));
  const surroundMajorR = Math.max(surroundOuterR - surroundTube, 0.0001);
  const surroundGeometry = new THREE.TorusGeometry(
    surroundMajorR,
    surroundTube,
    16,
    64
  );
  const surround = new THREE.Mesh(surroundGeometry, METAL_MATERIAL);
  surround.position.z = mmToUnits(mm(outerDiameterMm.value * 0.043)); // slight front lip
  group.add(surround);

  // Dust cap / dome
  const domeDiameterMm = outerDiameterMm.value * 0.33;
  const domeR = mmToUnits(mm(domeDiameterMm / 2));
  const domeGeometry = new THREE.SphereGeometry(domeR, 32, 32);
  const dome = new THREE.Mesh(domeGeometry, METAL_MATERIAL);
  dome.position.z = mmToUnits(mm(outerDiameterMm.value * 0.087));
  dome.castShadow = true;
  group.add(dome);

  return group;
}

function createBassPort({
  diameterMm,
}: {
  diameterMm: Milimeters;
}): THREE.Group {
  const r = mmToUnits(mm(diameterMm.value / 2));
  const depthMm = diameterMm.value * 0.25;
  const depth = mmToUnits(mm(depthMm));
  const group = new THREE.Group();

  const tubeGeometry = new THREE.CylinderGeometry(r, r, depth, 24);
  const tube = new THREE.Mesh(tubeGeometry, PORT_MATERIAL);
  tube.rotation.x = Math.PI / 2;
  tube.castShadow = true;
  group.add(tube);
  return group;
}

function createKnob({ diameterMm }: { diameterMm: Milimeters }): THREE.Group {
  const group = new THREE.Group();
  const r = mmToUnits(mm(diameterMm.value / 2));
  const depthMm = diameterMm.value * 0.4;
  const depth = mmToUnits(mm(depthMm));

  const knobGeometry = new THREE.CylinderGeometry(r, r, depth, 24);
  const knob = new THREE.Mesh(knobGeometry, METAL_MATERIAL);
  knob.rotation.x = Math.PI / 2;
  knob.castShadow = true;
  group.add(knob);

  const indicatorLengthMm = diameterMm.value * 0.38;
  const indicatorWidthMm = diameterMm.value * 0.08;
  const indicatorThicknessMm = diameterMm.value * 0.08;
  const indicatorGeometry = new THREE.BoxGeometry(
    mmToUnits(mm(indicatorWidthMm)),
    mmToUnits(mm(indicatorLengthMm)),
    mmToUnits(mm(indicatorThicknessMm))
  );
  const indicator = new THREE.Mesh(indicatorGeometry, INDICATOR_MATERIAL);
  indicator.position.y = mmToUnits(mm(indicatorLengthMm * 0.66));
  indicator.position.z = depth * 0.6;
  indicator.castShadow = true;
  group.add(indicator);

  return group;
}

function createHeadphoneJack(): THREE.Group {
  const group = new THREE.Group();

  // Hole
  const HOLE_DIAMETER_MM = 7.0;
  const HOLE_DEPTH_MM = 2.0;
  const holeR = mmToUnits(mm(HOLE_DIAMETER_MM / 2));
  const holeDepth = mmToUnits(mm(HOLE_DEPTH_MM));
  const holeGeometry = new THREE.CylinderGeometry(holeR, holeR, holeDepth, 24);
  const hole = new THREE.Mesh(holeGeometry, HOLE_MATERIAL);
  hole.rotation.x = Math.PI / 2;
  hole.position.z = -holeDepth / 2.0;
  group.add(hole);

  // Ring
  const RING_OUTER_DIAMETER_MM = 8.6;
  const RING_TUBE_MM = 0.8;
  const ringTube = mmToUnits(mm(RING_TUBE_MM));
  const ringOuterR = mmToUnits(mm(RING_OUTER_DIAMETER_MM / 2));
  const ringMajorR = Math.max(ringOuterR - ringTube, 0.0001);
  const ringGeometry = new THREE.TorusGeometry(ringMajorR, ringTube, 16, 32);
  const ring = new THREE.Mesh(ringGeometry, METAL_MATERIAL);
  ring.position.z = mmToUnits(mm(0.5));
  group.add(ring);

  return group;
}

function createLED({ diameterMm }: { diameterMm: Milimeters }): THREE.Mesh {
  const r = mmToUnits(mm(diameterMm.value / 2));
  const ledGeometry = new THREE.SphereGeometry(r, 16, 16);
  const led = new THREE.Mesh(ledGeometry, LED_MATERIAL);
  led.castShadow = true;
  return led;
}

function createBackPanel({
  rcaDiameterMm,
  rcaDepthMm,
  rcaSpacingMm,
  powerJackDiameterMm,
  powerJackDepthMm,
}: {
  rcaDiameterMm: Milimeters;
  rcaDepthMm: Milimeters;
  rcaSpacingMm: Milimeters;
  powerJackDiameterMm: Milimeters;
  powerJackDepthMm: Milimeters;
}): THREE.Group {
  const group = new THREE.Group();

  const rcaR = mmToUnits(mm(rcaDiameterMm.value / 2));
  const rcaDepth = mmToUnits(rcaDepthMm);
  const spacing = mmToUnits(mm(rcaSpacingMm.value / 2)); // half to each side

  const rcaPortGeometry = new THREE.CylinderGeometry(rcaR, rcaR, rcaDepth, 16);
  const rcaPortRed = new THREE.Mesh(rcaPortGeometry, RCA_RED_MATERIAL);
  rcaPortRed.position.set(-spacing, 0, 0);
  rcaPortRed.rotation.x = Math.PI / 2;
  group.add(rcaPortRed);

  const rcaPortWhite = new THREE.Mesh(rcaPortGeometry, RCA_WHITE_MATERIAL);
  rcaPortWhite.position.set(spacing, 0, 0);
  rcaPortWhite.rotation.x = Math.PI / 2;
  group.add(rcaPortWhite);

  const pjR = mmToUnits(mm(powerJackDiameterMm.value / 2));
  const pjDepth = mmToUnits(powerJackDepthMm);
  const powerJackGeometry = new THREE.CylinderGeometry(pjR, pjR, pjDepth, 16);
  const powerJack = new THREE.Mesh(powerJackGeometry, PORT_MATERIAL);
  powerJack.position.set(0, mmToUnits(mm(-50)), 0);
  powerJack.rotation.x = Math.PI / 2;
  group.add(powerJack);

  return group;
}

function createBrace({
  innerWidthMm,
  thicknessMm,
  innerDepthMm,
}: {
  innerWidthMm: Milimeters;
  thicknessMm: Milimeters;
  innerDepthMm: Milimeters;
}): THREE.Mesh {
  const w = mmToUnits(innerWidthMm);
  const t = mmToUnits(thicknessMm);
  const d = mmToUnits(innerDepthMm);
  const braceGeometry = new THREE.BoxGeometry(w, t, d);
  const brace = new THREE.Mesh(braceGeometry, BRACE_MATERIAL);
  brace.castShadow = true;
  return brace;
}

function inch(value: number) {
  return { value, unit: '"' } as const;
}
type Inch = ReturnType<typeof inch>;

export function mm(value: number) {
  return { value, unit: " mm" } as const;
}
type Milimeters = ReturnType<typeof mm>;

function inchToMm(length: Inch): Milimeters {
  return mm(length.value * 25.4);
}

function mmToUnits(mm: Milimeters): number {
  return mm.value / 100; // 100 mm = 1 scene unit
}
