import { useMemo } from "react";
import * as THREE from "three";
import { jscadToThree } from "@/src/jscad/jscadToThree";
import type { JscadModel } from "@/src/jscad/types";
import { ThreeModelViewer } from "./ThreeModelViewer";
import { downloadModelAsStl } from "@/src/jscad/downloadModel";
import "./JscadModelViewer.css";

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
      <ThreeModelViewer {...props} model={group} />
      <button
        className="download-button"
        onClick={() => downloadModelAsStl(model)}
        title="Download STL"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 10V16M12 16L9 13M12 16L15 13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12L19 10V19C19 20.1046 18.1046 21 17 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        STL
      </button>
    </div>
  );
}
