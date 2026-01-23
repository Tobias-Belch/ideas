import { materialId, type Materials } from "@jscad/types";

export const materials = {
  Black: {
    id: materialId([0.1, 0.1, 0.1]),
    color: [0.1, 0.1, 0.1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0x444444,
      specular: 0xdddddd,
      shininess: 50,
    },
  },
  Control: {
    id: materialId([0.1, 0.1, 0.1]),
    color: [0.1, 0.1, 0.1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0x1a1a1a,
      specular: 0x333333,
      shininess: 50,
    },
  },
  Gold: {
    id: materialId([0.8, 0.7, 0.5]),
    color: [0.8, 0.7, 0.5],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xccaa88,
      specular: 0xffffff,
      shininess: 100,
    },
  },
  Hole: {
    id: materialId([0, 0, 0]),
    color: [0, 0, 0],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0x000000,
      specular: 0x000000,
      shininess: 0,
    },
  },
  Led: {
    id: materialId([0, 1, 0]),
    color: [0, 1, 0],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0x00ff00,
      emissive: 0x008800,
      shininess: 100,
    },
  },
  Red: {
    id: materialId([0.8, 0.1, 0.1]),
    color: [0.8, 0.1, 0.1],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xcc4444,
      specular: 0xffdddd,
      shininess: 50,
    },
  },
  Steel: {
    id: materialId([0.75, 0.75, 0.75]),
    color: [0.75, 0.75, 0.75],
    three: {
      threeType: "MeshPhongMaterial",
      color: 0xc0c0c0,
      specular: 0xffffff,
      shininess: 100,
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
