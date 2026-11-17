import { ReactNode } from "react";
import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

export type Axis = "x" | "y";

export interface ChildrenAsProps {
  children?: ReactNode;
}

export interface RotationController {
  onTurn: (direction: DIRECTIONS) => void;
  isActive: boolean;
  contentAngle?: number;
}

export interface Paintable {
  background?: string;
  color: string;
}

export interface Faceable {
  face: FACES;
}
