import { FACES } from "@/constants/faces";
import { DIRECTIONS } from "@/constants/directions";

/**
 * Orientação do cubo como matriz de rotação 3x3 (linha a linha), no sistema de
 * coordenadas do CSS: x → direita, y → baixo, z → em direção ao usuário.
 *
 * Cada giro multiplica a orientação atual por uma rotação de 90° no eixo da
 * tela. Assim o cubo pode girar em qualquer sequência de direções sem os
 * problemas de ângulos de Euler (rotateX + rotateY), e a face visível e a
 * inclinação do seu conteúdo são sempre derivadas da matriz.
 */
export type Matrix = readonly number[];
export type Vector = readonly [number, number, number];
/** [x, y, z, w] */
export type Quaternion = readonly [number, number, number, number];
export type Axis = "x" | "y";

export const IDENTITY: Matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const SCREEN_FRONT: Vector = [0, 0, 1];
const SCREEN_UP: Vector = [0, -1, 0];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const mod = (value: number, base: number) => ((value % base) + base) % base;

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

/** Giro de 90° que cada direção aplica, no eixo da tela. */
export const TURNS: Record<DIRECTIONS, Matrix> = {
  [DIRECTIONS.RIGHT]: rotationY(-90),
  [DIRECTIONS.LEFT]: rotationY(90),
  [DIRECTIONS.UP]: rotationX(-90),
  [DIRECTIONS.DOWN]: rotationX(90),
};

/** Posição de cada face no cubo (mesmas rotações usadas no CSS das faces). */
const FACE_PLACEMENT: Record<FACES, Matrix> = {
  [FACES.FRONT]: IDENTITY,
  [FACES.BACK]: rotationY(180),
  [FACES.RIGHT]: rotationY(90),
  [FACES.LEFT]: rotationY(-90),
  [FACES.TOP]: rotationX(90),
  [FACES.BOTTOM]: rotationX(-90),
};

/** Direção para onde a face aponta e direção do "topo" do seu conteúdo. */
const FACE_FRAMES = (Object.keys(FACE_PLACEMENT) as FACES[]).map((face) => ({
  face,
  normal: transform(FACE_PLACEMENT[face], SCREEN_FRONT),
  up: transform(FACE_PLACEMENT[face], SCREEN_UP),
}));

const getFrame = (face: FACES) => FACE_FRAMES.find((f) => f.face === face)!;

/** Face voltada para o usuário nesta orientação. */
export const getActiveFace = (orientation: Matrix): FACES =>
  FACE_FRAMES.reduce((best, frame) =>
    transform(orientation, frame.normal)[2] >
    transform(orientation, best.normal)[2]
      ? frame
      : best,
  ).face;

/**
 * Rotação (graus, múltiplo de 90) a aplicar no conteúdo da face para que ele
 * fique em pé quando a face estiver de frente nesta orientação.
 */
export const getContentAngle = (face: FACES, orientation: Matrix) => {
  const [x, y] = transform(orientation, getFrame(face).up);
  // Ângulo, em sentido horário a partir do topo da tela, para onde o topo do
  // conteúdo aponta hoje. Girar o conteúdo no sentido oposto o endireita.
  const tilt = (Math.atan2(x, -y) * 180) / Math.PI;
  return mod(Math.round(-tilt / 90) * 90, 360);
};

/** Giro que traz a face até a frente pelo menor caminho (ou null se já está). */
export const getTurnToFace = (
  face: FACES,
  orientation: Matrix,
): Matrix | null => {
  const [x, y, z] = transform(orientation, getFrame(face).normal).map(
    Math.round,
  );

  if (z === 1) return null;
  if (x === 1) return TURNS[DIRECTIONS.RIGHT];
  if (x === -1) return TURNS[DIRECTIONS.LEFT];
  if (y === -1) return TURNS[DIRECTIONS.UP];
  if (y === 1) return TURNS[DIRECTIONS.DOWN];
  return rotationY(180);
};

export const toQuaternion = (m: Matrix): Quaternion => {
  const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m;
  const trace = m00 + m11 + m22;

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    return [(m21 - m12) * s, (m02 - m20) * s, (m10 - m01) * s, 0.25 / s];
  }
  if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    return [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  }
  if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    return [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s];
  }
  const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
  return [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s];
};

export const fromQuaternion = ([x, y, z, w]: Quaternion): Matrix => [
  1 - 2 * (y * y + z * z),
  2 * (x * y - z * w),
  2 * (x * z + y * w),
  2 * (x * y + z * w),
  1 - 2 * (x * x + z * z),
  2 * (y * z - x * w),
  2 * (x * z - y * w),
  2 * (y * z + x * w),
  1 - 2 * (x * x + y * y),
];

/**
 * Interpolação esférica pelo menor caminho. É o motivo de a animação ser feita
 * em JS: a interpolação de matrix3d pelo CSS não garante o menor caminho em
 * todos os navegadores (o cubo poderia girar 270° pelo lado errado).
 */
export const slerp = (a: Quaternion, b: Quaternion, t: number): Quaternion => {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const target = dot < 0 ? (b.map((v) => -v) as unknown as Quaternion) : b;
  dot = Math.abs(dot);

  if (dot > 0.9995) {
    const mixed = a.map((v, i) => v + (target[i] - v) * t);
    const length = Math.hypot(...mixed);
    return mixed.map((v) => v / length) as unknown as Quaternion;
  }

  const theta = Math.acos(Math.min(dot, 1));
  const sinTheta = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return a.map((v, i) => v * wa + target[i] * wb) as unknown as Quaternion;
};
