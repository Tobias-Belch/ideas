import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  model: THREE.Group;
  background?: number | string;
  style?: React.CSSProperties;
  className?: string;
  showAxes?: boolean;
}

export function ThreeModelViewer({
  model,
  background,
  showAxes = true,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // -------------------------
    // Scene & Camera
    // -------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background ?? 0x111111);

    scene.add(model);

    // Compute bounding sphere to position camera nicely
    const bounding = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    bounding.getCenter(center);
    const size = bounding.getSize(new THREE.Vector3()).length() || 50;

    // Helper function to create text sprites for axis labels
    const makeTextSprite = (text: string, color: string): THREE.Sprite => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 32;
      const context = canvas.getContext("2d")!;
      context.font = "Bold 20px Arial";
      context.fillStyle = color;
      context.fillText(text, 10, 20);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(5, 5, 1);
      return sprite;
    };

    // Add axes helper if requested
    let axesHelper: THREE.AxesHelper | undefined;
    let labels: THREE.Sprite[] = [];
    if (showAxes) {
      axesHelper = new THREE.AxesHelper(size * 0.5);
      scene.add(axesHelper);

      // Add axis labels
      const xLabel = makeTextSprite("X", "#ff0000");
      xLabel.position.set(size * 0.6, 0, 0);
      scene.add(xLabel);
      labels.push(xLabel);

      const yLabel = makeTextSprite("Y", "#00ff00");
      yLabel.position.set(0, size * 0.6, 0);
      scene.add(yLabel);
      labels.push(yLabel);

      const zLabel = makeTextSprite("Z", "#0000ff");
      zLabel.position.set(0, 0, size * 0.6);
      scene.add(zLabel);
      labels.push(zLabel);
    }

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(size * 0.8, size * 0.8, size * 0.8);
    camera.lookAt(center);

    // -------------------------
    // Renderer
    // -------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // -------------------------
    // Controls (OrbitControls)
    // -------------------------
    let controls: any;
    (async () => {
      const { OrbitControls } =
        await import("three/examples/jsm/controls/OrbitControls.js");
      controls = new OrbitControls(camera, renderer.domElement);

      // Enable panning explicitly
      controls.enablePan = true;

      // Optional: make panning feel nice
      controls.panSpeed = 1.0;
      controls.screenSpacePanning = true; // pan parallel to screen

      controls.target.copy(center);
      controls.update();
    })();

    // -------------------------
    // Lights
    // -------------------------
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(1, 1, 1);
    scene.add(dir);

    // -------------------------
    // Animation loop
    // -------------------------
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // -------------------------
    // Cleanup
    // -------------------------
    return () => {
      cancelAnimationFrame(frame);

      // Dispose renderer
      renderer.dispose();

      // Remove axes helper
      if (axesHelper) {
        scene.remove(axesHelper);
      }

      // Remove axis labels
      for (const label of labels) {
        scene.remove(label);
        if (label.material.map) {
          label.material.map.dispose();
        }
        label.material.dispose();
      }

      // Remove canvas
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      // Optionally dispose geometries & materials
      model.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m?.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [model, background, showAxes]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
