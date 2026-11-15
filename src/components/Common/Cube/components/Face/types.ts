import {
  ChildrenAsProps,
  Faceable,
  Paintable,
  RotationController,
} from "@/types";

export interface CubeFaceProps
  extends ChildrenAsProps,
    Paintable,
    Faceable,
    RotationController {
  title?: string;
  /** Nível semântico do título (a face inicial usa h1). */
  titleAs?: "h1" | "h2";
}

export type CubeFaceContentProps = Paintable & RotationController;
