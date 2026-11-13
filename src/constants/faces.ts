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
  /** Rotação do cubo que deixa esta face voltada para o usuário. */
  coordinate: Coordinate;
}

export const FACES_DATA: Record<FACES, FaceData> = {
  [FACES.FRONT]: { label: "Início", coordinate: { x: 0, y: 0 } },
  [FACES.RIGHT]: { label: "Experiência", coordinate: { x: -90, y: 0 } },
  [FACES.BACK]: { label: "Stack", coordinate: { x: 180, y: 0 } },
  [FACES.LEFT]: { label: "Contato", coordinate: { x: 90, y: 0 } },
  [FACES.TOP]: { label: "Projetos", coordinate: { x: 0, y: -90 } },
  [FACES.BOTTOM]: { label: "Formação", coordinate: { x: 0, y: 90 } },
};

/** Faces do "anel" horizontal, na ordem em que aparecem girando para a direita. */
export const RING_ORDER = [FACES.FRONT, FACES.RIGHT, FACES.BACK, FACES.LEFT];

/** Ordem de leitura usada na navegação abaixo do cubo. */
export const NAV_ORDER = [
  FACES.FRONT,
  FACES.RIGHT,
  FACES.TOP,
  FACES.BACK,
  FACES.BOTTOM,
  FACES.LEFT,
];
