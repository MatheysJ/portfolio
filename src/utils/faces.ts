import { FACES, FACES_DATA } from "@/constants/faces";

export const getFaceBySlug = (slug: string): FACES | undefined =>
  (Object.keys(FACES_DATA) as FACES[]).find(
    (face) => FACES_DATA[face].slug === slug,
  );

/** Hash da URL para a face. A face inicial fica sem hash. */
export const getFaceHash = (face: FACES) =>
  face === FACES.FRONT ? "" : `#${FACES_DATA[face].slug}`;

/** Título exibido no topo da face. */
export const getFaceTitle = (face: FACES) =>
  FACES_DATA[face].label.toLocaleUpperCase("pt-BR");
