import { useMemo } from "react";
import * as THREE from "three";
import { jscadToThree } from "@/src/jscad/jscadToThree";
import { ThreeModelViewer } from "./ThreeModelViewer";
import type { JscadModel } from "@/src/jscad/types";

export interface Props {
  /** JSCAD geometry (single, array, or nested arrays) */
  input: JscadModel;
  /** Optional: scene background (hex number or CSS style string) */
  background?: number | string;
  /** Optional: inline style for container div */
  style?: React.CSSProperties;
  /** Optional: class for container div */
  className?: string;
}

export function JscadModelViewer({ input, ...props }: Props) {
  const group = useMemo<THREE.Group>(() => {
    return jscadToThree(input);
  }, [input]);

  return <ThreeModelViewer {...props} group={group} />;
}
