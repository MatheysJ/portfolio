import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";
import { ReactNode } from "react";

export interface ChildrenAsProps {
  children?: ReactNode;
}

export interface Sized {
  size: number;
}

export interface RotationController {
  onTurn: (direction: DIRECTIONS) => void;
  /** Indica se a face está voltada para o usuário. */
  isActive: boolean;
  /** Rotação (graus) do conteúdo da face no próprio plano. */
  contentAngle?: number;
}

export interface Coordinate {
  /** Rotação no eixo Y (giro horizontal), em graus. */
  x: number;
  /** Rotação no eixo X (giro vertical), em graus. */
  y: number;
}

export interface Paintable {
  background?: string;
  color: string;
}

export interface Faceable {
  face: FACES;
}
