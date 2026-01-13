// SpeakerModel: Option 1 – Full-Range Driver (Simpler)
// This model represents a single 3–4" full-range driver per riser, with no tweeter or crossover.
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Group } from "three";

export const configurations = [
  "One Fullrange Driver",
  "Separate Tweeter & Woofer",
] as const;

type Configuration = (typeof configurations)[number];

type Props = {
  width: Milimeters;
  height: Milimeters;
  depth: Milimeters;
  configuration: Configuration;
};

export default function SpeakerModel({ width, height, depth }: Props) {
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
    const WIDTH = mmToUnits(WIDTH_MM);
    const HEIGHT = mmToUnits(HEIGHT_MM);
    const DEPTH = mmToUnits(DEPTH_MM);

    // Main enclosure box + wireframe
    const enclosureGroup = createEnclosure({
      widthMm: WIDTH_MM,
      heightMm: HEIGHT_MM,
      depthMm: DEPTH_MM,
    });
    groupRef.current.add(enclosureGroup);

    // --- Controls Row (bottom front) ---
    // Layout: [knob]   [jack]   [LED] (spaced evenly)
    // Reduce bottom margin to 16mm, knob is now 15mm diameter
    const controlsRowMarginBottomMm = 20;
    const controlsY = -HEIGHT / 2 + mmToUnits(controlsRowMarginBottomMm);
    const controlsZ = DEPTH / 2;
    const controlsRow = [
      { type: "knob", comp: createKnob({ diameterMm: 15 }) },
      { type: "jack", comp: createHeadphoneJack() },
      { type: "led", comp: createLED({ diameterMm: 10 }) },
    ];
    const controlsCount = controlsRow.length;
    const controlsSpacing = WIDTH / (controlsCount + 1);
    controlsRow.forEach((item, i) => {
      item.comp.position.set(
        -WIDTH / 2 + controlsSpacing * (i + 1),
        controlsY,
        controlsZ
      );
      groupRef.current!.add(item.comp);
    });

    // --- Full-range driver and bass port (Option 1) ---
    // One 3–4" full-range driver per riser, no tweeter, no crossover
    // Driver outer diameter: 92mm (~3.6")
    const PORT_DIAMETER_MM = 30; // Reduced port size
    const DRIVER_OD_MM = 92; // 3.6" full-range driver
    const portRadiusMm = PORT_DIAMETER_MM / 2;
    const driverRadiusMm = DRIVER_OD_MM / 2;

    // Controls row top Y (in mm)
    const controlsRowTopY_mm = -HEIGHT_MM / 2 + controlsRowMarginBottomMm + 7.5; // 7.5mm = half knob height
    // Reduce gap above controls to 10mm, port is smaller
    const portGapAboveControls_mm = 10;
    const portCenterY_mm =
      controlsRowTopY_mm + portGapAboveControls_mm + portRadiusMm;
    // Reduce gap between port and driver to 10mm
    const gapMm = 10;
    const driverCenterY_mm =
      portCenterY_mm + portRadiusMm + gapMm + driverRadiusMm;

    // Bass reflex port (centered above controls)
    const portGroup = createBassPort({ diameterMm: PORT_DIAMETER_MM });
    portGroup.position.set(0, mmToUnits(portCenterY_mm), DEPTH / 2);
    groupRef.current!.add(portGroup);

    // Full-range driver (no tweeter)
    const driverGroup = createDriver({ outerDiameterMm: DRIVER_OD_MM });
    driverGroup.position.set(0, mmToUnits(driverCenterY_mm), DEPTH / 2);
    groupRef.current!.add(driverGroup);

    // --- Back Panel ---
    const backPanelGroup = createBackPanel({
      rcaDiameterMm: 16,
      rcaDepthMm: 15,
      rcaSpacingMm: 60,
      powerJackDiameterMm: 20,
      powerJackDepthMm: 15,
    });
    backPanelGroup.position.z = -DEPTH / 2;
    groupRef.current!.add(backPanelGroup);

    // Internal bracing visualization (semi-transparent)
    const brace = createBrace({
      innerWidthMm: WIDTH_MM - 20,
      thicknessMm: 15,
      innerDepthMm: DEPTH_MM - 40,
    });
    brace.position.y = mmToUnits(-30);
    groupRef.current!.add(brace);
  }, []);

  return (
    <group
      ref={groupRef as React.RefObject<THREE.Group>}
      position={[0, 0, 0]}
    />
  );
}

// --- Helpers ---
const mmToUnits = (mm: number): number => mm / 100; // 100 mm = 1 scene unit

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
  widthMm: number;
  heightMm: number;
  depthMm: number;
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
  outerDiameterMm: number;
}): THREE.Group {
  const group = new THREE.Group();

  // Cone
  const coneDiameterMm = outerDiameterMm * 0.76;
  const coneDepthMm = outerDiameterMm * 0.13;
  const coneR = mmToUnits(coneDiameterMm / 2);
  const coneDepth = mmToUnits(coneDepthMm);
  const coneGeometry = new THREE.CylinderGeometry(coneR, coneR, coneDepth, 64);
  const cone = new THREE.Mesh(coneGeometry, DRIVER_MATERIAL);
  cone.rotation.x = Math.PI / 2;
  cone.castShadow = true;
  group.add(cone);

  // Surround ring (faces +Z by default)
  const surroundTubeMm = outerDiameterMm * 0.09;
  const surroundTube = mmToUnits(surroundTubeMm);
  const surroundOuterR = mmToUnits(outerDiameterMm / 2);
  const surroundMajorR = Math.max(surroundOuterR - surroundTube, 0.0001);
  const surroundGeometry = new THREE.TorusGeometry(
    surroundMajorR,
    surroundTube,
    16,
    64
  );
  const surround = new THREE.Mesh(surroundGeometry, METAL_MATERIAL);
  surround.position.z = mmToUnits(outerDiameterMm * 0.043); // slight front lip
  group.add(surround);

  // Dust cap / dome
  const domeDiameterMm = outerDiameterMm * 0.33;
  const domeR = mmToUnits(domeDiameterMm / 2);
  const domeGeometry = new THREE.SphereGeometry(domeR, 32, 32);
  const dome = new THREE.Mesh(domeGeometry, METAL_MATERIAL);
  dome.position.z = mmToUnits(outerDiameterMm * 0.087);
  dome.castShadow = true;
  group.add(dome);

  return group;
}

function createBassPort({ diameterMm }: { diameterMm: number }): THREE.Group {
  const r = mmToUnits(diameterMm / 2);
  const depthMm = diameterMm * 0.25;
  const depth = mmToUnits(depthMm);
  const group = new THREE.Group();

  const tubeGeometry = new THREE.CylinderGeometry(r, r, depth, 24);
  const tube = new THREE.Mesh(tubeGeometry, PORT_MATERIAL);
  tube.rotation.x = Math.PI / 2;
  tube.castShadow = true;
  group.add(tube);
  return group;
}

function createKnob({ diameterMm }: { diameterMm: number }): THREE.Group {
  const group = new THREE.Group();
  const r = mmToUnits(diameterMm / 2);
  const depthMm = diameterMm * 0.4;
  const depth = mmToUnits(depthMm);

  const knobGeometry = new THREE.CylinderGeometry(r, r, depth, 24);
  const knob = new THREE.Mesh(knobGeometry, METAL_MATERIAL);
  knob.rotation.x = Math.PI / 2;
  knob.castShadow = true;
  group.add(knob);

  const indicatorLengthMm = diameterMm * 0.38;
  const indicatorWidthMm = diameterMm * 0.08;
  const indicatorThicknessMm = diameterMm * 0.08;
  const indicatorGeometry = new THREE.BoxGeometry(
    mmToUnits(indicatorWidthMm),
    mmToUnits(indicatorLengthMm),
    mmToUnits(indicatorThicknessMm)
  );
  const indicator = new THREE.Mesh(indicatorGeometry, INDICATOR_MATERIAL);
  indicator.position.y = mmToUnits(indicatorLengthMm * 0.66);
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
  const holeR = mmToUnits(HOLE_DIAMETER_MM / 2);
  const holeDepth = mmToUnits(HOLE_DEPTH_MM);
  const holeGeometry = new THREE.CylinderGeometry(holeR, holeR, holeDepth, 24);
  const hole = new THREE.Mesh(holeGeometry, HOLE_MATERIAL);
  hole.rotation.x = Math.PI / 2;
  hole.position.z = -holeDepth / 2.0;
  group.add(hole);

  // Ring
  const RING_OUTER_DIAMETER_MM = 8.6;
  const RING_TUBE_MM = 0.8;
  const ringTube = mmToUnits(RING_TUBE_MM);
  const ringOuterR = mmToUnits(RING_OUTER_DIAMETER_MM / 2);
  const ringMajorR = Math.max(ringOuterR - ringTube, 0.0001);
  const ringGeometry = new THREE.TorusGeometry(ringMajorR, ringTube, 16, 32);
  const ring = new THREE.Mesh(ringGeometry, METAL_MATERIAL);
  ring.position.z = mmToUnits(0.5);
  group.add(ring);

  return group;
}

function createLED({ diameterMm }: { diameterMm: number }): THREE.Mesh {
  const r = mmToUnits(diameterMm / 2);
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
  rcaDiameterMm: number;
  rcaDepthMm: number;
  rcaSpacingMm: number;
  powerJackDiameterMm: number;
  powerJackDepthMm: number;
}): THREE.Group {
  const group = new THREE.Group();

  const rcaR = mmToUnits(rcaDiameterMm / 2);
  const rcaDepth = mmToUnits(rcaDepthMm);
  const spacing = mmToUnits(rcaSpacingMm / 2); // half to each side

  const rcaPortGeometry = new THREE.CylinderGeometry(rcaR, rcaR, rcaDepth, 16);
  const rcaPortRed = new THREE.Mesh(rcaPortGeometry, RCA_RED_MATERIAL);
  rcaPortRed.position.set(-spacing, 0, 0);
  rcaPortRed.rotation.x = Math.PI / 2;
  group.add(rcaPortRed);

  const rcaPortWhite = new THREE.Mesh(rcaPortGeometry, RCA_WHITE_MATERIAL);
  rcaPortWhite.position.set(spacing, 0, 0);
  rcaPortWhite.rotation.x = Math.PI / 2;
  group.add(rcaPortWhite);

  const pjR = mmToUnits(powerJackDiameterMm / 2);
  const pjDepth = mmToUnits(powerJackDepthMm);
  const powerJackGeometry = new THREE.CylinderGeometry(pjR, pjR, pjDepth, 16);
  const powerJack = new THREE.Mesh(powerJackGeometry, PORT_MATERIAL);
  powerJack.position.set(0, mmToUnits(-50), 0);
  powerJack.rotation.x = Math.PI / 2;
  group.add(powerJack);

  return group;
}

function createBrace({
  innerWidthMm,
  thicknessMm,
  innerDepthMm,
}: {
  innerWidthMm: number;
  thicknessMm: number;
  innerDepthMm: number;
}): THREE.Mesh {
  const w = mmToUnits(innerWidthMm);
  const t = mmToUnits(thicknessMm);
  const d = mmToUnits(innerDepthMm);
  const braceGeometry = new THREE.BoxGeometry(w, t, d);
  const brace = new THREE.Mesh(braceGeometry, BRACE_MATERIAL);
  brace.castShadow = true;
  return brace;
}

type Milimeters = number;
