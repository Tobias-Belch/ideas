import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import SpeakerModel from "./SpeakerModel";
import "./viewer.css";

export default function Viewer({
  width,
  height,
  depth,
}: Pick<Parameters<typeof SpeakerModel>[0], "width" | "height" | "depth">) {
  return (
    <div className="container">
      <Canvas style={{ height: "100%", width: "100%" }}>
        <PerspectiveCamera makeDefault position={[20, 10, 60]} zoom={10} />
        <OrbitControls autoRotate={false} enableZoom={true} enablePan={true} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />

        <SpeakerModel
          width={width}
          height={height}
          depth={depth}
          configuration="One Fullrange Driver"
        />
      </Canvas>
      <div className="info">
        <h1>Monitor Riser Speaker - 3D Viewer</h1>
        <div className="specs">
          <p>
            <strong>Dimensions:</strong> {width / 10}cm (W) × {height / 10}cm
            (H) × {depth / 10}cm (D)
          </p>
          <p>
            <strong>Volume:</strong> ~
            {Math.round(((width / 10) * (height / 10) * (depth / 10)) / 100) /
              10}{" "}
            liters
          </p>
        </div>
      </div>
    </div>
  );
}
