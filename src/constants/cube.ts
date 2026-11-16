import { Axis } from "@/types";
import { FACES } from "./faces";

/** Variável CSS lida pelas faces: `transform: matrix3d(var(...)) ...`. */
export const ORIENTATION_VAR = "--cube-orientation";

interface Placement {
  axis: Axis;
  degrees: number;
}

/**
 * Posição de cada face no cubo, como giro a partir da face da frente. É a
 * fonte única usada tanto no CSS das faces quanto no cálculo da orientação.
 */
export const FACE_PLACEMENT: Record<FACES, Placement> = {
  [FACES.FRONT]: { axis: "y", degrees: 0 },
  [FACES.BACK]: { axis: "y", degrees: 180 },
  [FACES.RIGHT]: { axis: "y", degrees: 90 },
  [FACES.LEFT]: { axis: "y", degrees: -90 },
  [FACES.TOP]: { axis: "x", degrees: 90 },
  [FACES.BOTTOM]: { axis: "x", degrees: -90 },
};
