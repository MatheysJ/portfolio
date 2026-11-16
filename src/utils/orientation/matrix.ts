import { Axis } from "@/types";
import { toRadians } from "@/utils/math";

import { Matrix, Vector } from "./types";

export const IDENTITY: Matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** Seno e cosseno exatos para múltiplos de 90°, evitando resíduos como 6e-17. */
const trig = (degrees: number) => {
  const radians = toRadians(degrees);
  const exact = degrees % 90 === 0;
  const round = (value: number) => (exact ? Math.round(value) : value);
  return { cos: round(Math.cos(radians)), sin: round(Math.sin(radians)) };
};

/** Equivalente a rotateX() do CSS. */
export const rotationX = (degrees: number): Matrix => {
  const { cos, sin } = trig(degrees);
  return [1, 0, 0, 0, cos, -sin, 0, sin, cos];
};

/** Equivalente a rotateY() do CSS. */
export const rotationY = (degrees: number): Matrix => {
  const { cos, sin } = trig(degrees);
  return [cos, 0, sin, 0, 1, 0, -sin, 0, cos];
};

export const rotation = (axis: Axis, degrees: number) =>
  axis === "x" ? rotationX(degrees) : rotationY(degrees);

export const multiply = (a: Matrix, b: Matrix): Matrix =>
  Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    return (
      a[row * 3] * b[column] +
      a[row * 3 + 1] * b[3 + column] +
      a[row * 3 + 2] * b[6 + column]
    );
  });

export const transform = (m: Matrix, [x, y, z]: Vector): Vector => [
  m[0] * x + m[1] * y + m[2] * z,
  m[3] * x + m[4] * y + m[5] * z,
  m[6] * x + m[7] * y + m[8] * z,
];

export const isSameMatrix = (a: Matrix, b: Matrix) =>
  a.every((value, index) => Math.abs(value - b[index]) < 1e-9);

/** Valor para `matrix3d()` (o CSS lê a matriz coluna a coluna). */
export const toMatrix3d = (m: Matrix) =>
  [m[0], m[3], m[6], 0, m[1], m[4], m[7], 0, m[2], m[5], m[8], 0, 0, 0, 0, 1]
    .map((value) => +value.toFixed(6))
    .join(", ");

export const IDENTITY_MATRIX3D = toMatrix3d(IDENTITY);
