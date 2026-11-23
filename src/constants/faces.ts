export enum FACES {
  FRONT = "FRONT",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BACK = "BACK",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

interface FaceData {
  slug: string;
}

export const FACES_DATA: Record<FACES, FaceData> = {
  [FACES.FRONT]: { slug: "inicio" },
  [FACES.RIGHT]: { slug: "experiencia" },
  [FACES.BACK]: { slug: "stack" },
  [FACES.LEFT]: { slug: "contato" },
  [FACES.TOP]: { slug: "projetos" },
  [FACES.BOTTOM]: { slug: "formacao" },
};

export const FACE_ORDER = [
  FACES.FRONT,
  FACES.RIGHT,
  FACES.TOP,
  FACES.BACK,
  FACES.BOTTOM,
  FACES.LEFT,
];
