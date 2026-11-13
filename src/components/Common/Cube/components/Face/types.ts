import {
  ChildrenAsProps,
  Faceable,
  Paintable,
  RotationController,
  Sized,
} from "@/types";

export interface CubeFaceProps
  extends ChildrenAsProps,
    Sized,
    Paintable,
    Faceable,
    RotationController {
  title?: string;
}

export type CubeFaceContentProps = Sized & Paintable & RotationController;
