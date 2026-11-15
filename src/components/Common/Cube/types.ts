import { CubeRotation } from "@/hooks";
import { Paintable } from "@/types";

export interface CubeProps extends Paintable {
  rotation: CubeRotation;
}
