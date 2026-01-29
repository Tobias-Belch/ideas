import { materialId, type Materials } from "@jscad/types";

export const materials = {
  Cabinet: {
    id: materialId([1, 1, 1, 1]),
    color: [1, 1, 1, 1],
    outline: [0, 0, 0.5, 1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 50,
    },
  },
  Obstacle: {
    id: materialId([1, 0, 0, 1]),
    color: [1, 0, 0, 1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xff0000,
      specular: 0xffdddd,
      shininess: 0,
    },
  },
  Space: {
    id: materialId([0.5, 0.5, 0.5, 0.2]),
    color: [0.5, 0.5, 0.5, 0.2],
    three: {
      threeType: "MeshPhongMaterial",
      specular: 0xdddddd,
      shininess: 0,
    },
  },
  Wood: {
    id: materialId([0.6, 0.3, 0.1]),
    color: [0.6, 0.3, 0.1],
    outline: [1, 1, 1, 0.2],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xa0522d, // warmer, more wood-like brown
      specular: 0x222111, // subtle, warm specular
      shininess: 8, // lower shininess for a matte look
    },
  },
} as const satisfies Materials;
