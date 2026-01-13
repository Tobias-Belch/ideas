import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useState } from "react";
import SpeakerModel, {
  Configurations,
  type Configuration,
} from "./SpeakerModel";
import "./viewer.css";

const configurations = Object.keys(Configurations) as Configuration[];

export default function Viewer({
  width,
  height,
  depth,
}: Pick<Parameters<typeof SpeakerModel>[0], "width" | "height" | "depth">) {
  const [configuration, setConfiguration] = useState<Configuration>(
    configurations[0]
  );

  return (
    <div className="container">
      <Canvas style={{ height: "100%", width: "100%" }}>
        <PerspectiveCamera makeDefault position={[20, 10, 50]} zoom={10} />
        <OrbitControls autoRotate={false} enableZoom={true} enablePan={true} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        <group position={[1.3, 0, 0]}>
          <SpeakerModel
            key={configuration}
            width={width}
            height={height}
            depth={depth}
            configuration={configuration}
          />
        </group>
      </Canvas>
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
            onChange={(e) => setConfiguration(e.target.value as Configuration)}
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
    </div>
  );
}
