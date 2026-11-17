import { Axis } from "@/types";
import { FACES } from "./faces";

export const ORIENTATION_VAR = "--cube-orientation";

interface Placement {
  axis: Axis;
  degrees: number;
}

export const FACE_PLACEMENT: Record<FACES, Placement> = {
  [FACES.FRONT]: { axis: "y", degrees: 0 },
  [FACES.BACK]: { axis: "y", degrees: 180 },
  [FACES.RIGHT]: { axis: "y", degrees: 90 },
  [FACES.LEFT]: { axis: "y", degrees: -90 },
  [FACES.TOP]: { axis: "x", degrees: 90 },
  [FACES.BOTTOM]: { axis: "x", degrees: -90 },
};
