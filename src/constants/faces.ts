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
}

export const FACES_DATA: Record<FACES, FaceData> = {
  [FACES.FRONT]: {
    label: "Início",
    slug: "inicio",
  },
  [FACES.RIGHT]: {
    label: "Experiência",
    slug: "experiencia",
  },
  [FACES.BACK]: {
    label: "Stack",
    slug: "stack",
  },
  [FACES.LEFT]: {
    label: "Contato",
    slug: "contato",
  },
  [FACES.TOP]: {
    label: "Projetos",
    slug: "projetos",
  },
  [FACES.BOTTOM]: {
    label: "Formação",
    slug: "formacao",
  },
};

export const getFaceBySlug = (slug: string): FACES | undefined =>
  (Object.keys(FACES_DATA) as FACES[]).find(
    (face) => FACES_DATA[face].slug === slug,
  );

export const NAV_ORDER = [
  FACES.FRONT,
  FACES.RIGHT,
  FACES.TOP,
  FACES.BACK,
  FACES.BOTTOM,
  FACES.LEFT,
];
