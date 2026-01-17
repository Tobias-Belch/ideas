import { useMemo } from "react";
import * as THREE from "three";
import DownloadIcon from "@components/icons/react/DownloadIcon";
import { jscadToThree } from "@jscad/jscadToThree";
import type { JscadModel } from "@jscad/types";
import { downloadModelAsStl } from "@jscad/downloadModel";
import { ThreeModelViewer } from "./ThreeModelViewer";
import "./styles.css";

export interface Props {
  /** JSCAD geometry (single, array, or nested arrays) */
  model: JscadModel;
  /** Optional: scene background (hex number or CSS style string) */
  background?: number | string;
  /** Optional: inline style for container div */
  style?: React.CSSProperties;
  /** Optional: class for container div */
  className?: string;
}

export function JscadModelViewer({ model, className, style, ...props }: Props) {
  const group = useMemo<THREE.Group>(() => {
    return jscadToThree(model);
  }, [model]);

  return (
    <div className={`jscad-model-viewer ${className || ""}`} style={style}>
      <ThreeModelViewer
        {...props}
        model={group}
        withActions={[
          "camera",
          <button
            className="floating"
            onClick={() => downloadModelAsStl(model)}
            title="Download as STL"
          >
            <DownloadIcon />
          </button>,
        ]}
      />
    </div>
  );
}
