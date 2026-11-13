import { CubeRotation } from "@/hooks";
import { Paintable, Sized } from "@/types";

export interface CubeProps extends Sized, Paintable {
  rotation: CubeRotation;
}
