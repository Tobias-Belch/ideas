import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useState, useRef } from "react";
import SpeakerModel, {
  Configurations,
  type Configuration,
} from "./SpeakerModel";
import "./viewer.css";

const FrontIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="6"
      width="4"
      height="4"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M2 8 L10 8 M10 8 L8 6 M10 8 L8 10"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const SideIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="6"
      width="4"
      height="4"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M8 14 L8 6 M8 6 L6 8 M8 6 L10 8"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="6"
      width="4"
      height="4"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M14 8 L6 8 M6 8 L8 6 M6 8 L8 10"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const TopIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="6"
      width="4"
      height="4"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M8 2 L8 10 M8 10 L6 8 M8 10 L10 8"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const configurations = Object.keys(Configurations) as Configuration[];

const Modes = {
  viewer: {
    camera: {
      position: [20, 10, 50],
      zoom: 10,
    },
    position: [1.3, 0, 0],
  },
  "model-only": {
    camera: {
      position: [20, 10, 50],
      zoom: 15,
    },
    position: [0, 0, 0],
  },
} as const;

type Mode = keyof typeof Modes;

const positions = {
  viewer: [1.3, 0, 0],
  "model-only": [0, 0, 0],
} as const;

type Props = Pick<
  Parameters<typeof SpeakerModel>[0],
  "width" | "height" | "depth"
> & {
  configuration?: Configuration;
  mode?: Mode;
};

export default function Viewer({
  width,
  height,
  depth,
  configuration: initialConfiguration = configurations[0],
  mode = "viewer",
}: Props) {
  const [configuration, setConfiguration] =
    useState<Configuration>(initialConfiguration);
  const [opacity, setOpacity] = useState(0.8);
  const controlsRef = useRef<any>(null);

  const modeProps = Modes[mode];

  const setCameraView = (view: "front" | "side" | "back" | "top") => {
    if (!controlsRef.current) return;

    let position: [number, number, number];

    switch (view) {
      case "front":
        position = [0, 0, 50];
        break;
      case "side":
        position = [50, 0, 0];
        break;
      case "back":
        position = [0, 0, -50];
        break;
      case "top":
        position = [0, 70, 0];
        break;
    }

    controlsRef.current.object.position.set(...position);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="container">
      <Canvas style={{ height: "100%", width: "100%" }}>
        <PerspectiveCamera
          makeDefault
          position={modeProps.camera.position}
          zoom={modeProps.camera.zoom}
        />
        <OrbitControls
          ref={controlsRef}
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
        />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        <group position={modeProps.position}>
          <SpeakerModel
            opacity={opacity}
            key={configuration}
            width={width}
            height={height}
            depth={depth}
            configuration={configuration}
          />
        </group>
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.6)",
          padding: "10px 20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "white",
            fontSize: "14px",
          }}
        >
          <span>Opacity:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{
              width: "100px",
            }}
          />
          <span style={{ color: "white", fontSize: "14px", minWidth: "35px" }}>
            {(opacity * 100).toFixed(0)}%
          </span>
        </label>

        <div style={{ display: "flex", gap: "5px", marginLeft: "10px" }}>
          <button
            onClick={() => setCameraView("front")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Front View"
          >
            <FrontIcon />
          </button>
          <button
            onClick={() => setCameraView("side")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Side View"
          >
            <SideIcon />
          </button>
          <button
            onClick={() => setCameraView("back")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Back View"
          >
            <BackIcon />
          </button>
          <button
            onClick={() => setCameraView("top")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Top View"
          >
            <TopIcon />
          </button>
        </div>
      </div>

      {mode === "viewer" && (
        <div className="info">
          <h1>Monitor Riser Speaker - 3D Viewer</h1>
          <div className="specs">
            <p>
              <strong>Dimensions:</strong>
              {` ${width.value}
            ${width.unit} (W) × ${height.value}
            ${height.unit} (H) × ${depth.value}
            ${depth.unit} (D)`}
            </p>
            <p>
              <strong>Volume:</strong>
              {` ~${
                Math.round(
                  ((width.value / 10) *
                    (height.value / 10) *
                    (depth.value / 10)) /
                    100
                ) / 10
              }
            liters`}
            </p>
          </div>
          <div>
            <select
              value={configuration}
              onChange={(e) =>
                setConfiguration(e.target.value as Configuration)
              }
              style={{ width: "100%" }}
            >
              {configurations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="specs">
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              {Object.entries(Configurations[configuration]).map(
                ([componentName, { diameter }]) => (
                  <li key={componentName}>
                    <strong>{componentName}:</strong>
                    {` ${diameter.value}${diameter.unit}`}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
