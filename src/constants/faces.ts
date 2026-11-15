import { Coordinate } from "@/types";

export enum FACES {
  FRONT = "FRONT",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BACK = "BACK",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

interface FaceData {
  label: string;
  slug: string;
  coordinate: Coordinate;
}

export const FACES_DATA: Record<FACES, FaceData> = {
  [FACES.FRONT]: {
    label: "Início",
    slug: "inicio",
    coordinate: { x: 0, y: 0 },
  },
  [FACES.RIGHT]: {
    label: "Experiência",
    slug: "experiencia",
    coordinate: { x: -90, y: 0 },
  },
  [FACES.BACK]: {
    label: "Stack",
    slug: "stack",
    coordinate: { x: 180, y: 0 },
  },
  [FACES.LEFT]: {
    label: "Contato",
    slug: "contato",
    coordinate: { x: 90, y: 0 },
  },
  [FACES.TOP]: {
    label: "Projetos",
    slug: "projetos",
    coordinate: { x: 0, y: -90 },
  },
  [FACES.BOTTOM]: {
    label: "Formação",
    slug: "formacao",
    coordinate: { x: 0, y: 90 },
  },
};

export const getFaceBySlug = (slug: string): FACES | undefined =>
  (Object.keys(FACES_DATA) as FACES[]).find(
    (face) => FACES_DATA[face].slug === slug,
  );

export const RING_ORDER = [FACES.FRONT, FACES.RIGHT, FACES.BACK, FACES.LEFT];

export const NAV_ORDER = [
  FACES.FRONT,
  FACES.RIGHT,
  FACES.TOP,
  FACES.BACK,
  FACES.BOTTOM,
  FACES.LEFT,
];
