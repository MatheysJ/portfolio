import {
  ChildrenAsProps,
  Faceable,
  Paintable,
  RotationController,
} from "@/types";

export type CubeFaceContentProps = Paintable & Faceable & RotationController;

export interface CubeFaceProps extends ChildrenAsProps, CubeFaceContentProps {
  title?: string;
  titleAs?: "h1" | "h2";
}
