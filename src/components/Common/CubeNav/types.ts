import { FACES } from "@/constants/faces";

export interface CubeNavProps {
  activeFace: FACES;
  onSelect: (face: FACES) => void;
}
