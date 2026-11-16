import { FACE_PLACEMENT } from "@/constants/cube";
import { DIRECTIONS } from "@/constants/directions";
import { FACES } from "@/constants/faces";
import { mod, toDegrees } from "@/utils/math";

import { rotation, rotationX, rotationY, transform } from "./matrix";
import { Matrix, Vector } from "./types";

/*
 * Regras do cubo sobre a orientação: cada giro multiplica a orientação atual
 * por uma rotação de 90° no eixo da tela. Assim o cubo gira em qualquer
 * sequência de direções sem os problemas de ângulos de Euler, e a face visível
 * e a inclinação do seu conteúdo são sempre derivadas da matriz.
 */

const SCREEN_FRONT: Vector = [0, 0, 1];
const SCREEN_UP: Vector = [0, -1, 0];

/** Giro de 90° que cada direção aplica, no eixo da tela. */
export const TURNS: Record<DIRECTIONS, Matrix> = {
  [DIRECTIONS.RIGHT]: rotationY(-90),
  [DIRECTIONS.LEFT]: rotationY(90),
  [DIRECTIONS.UP]: rotationX(-90),
  [DIRECTIONS.DOWN]: rotationX(90),
};

/** Direção para onde cada face aponta e direção do "topo" do seu conteúdo. */
const FACE_FRAMES = (Object.keys(FACE_PLACEMENT) as FACES[]).map((face) => {
  const { axis, degrees } = FACE_PLACEMENT[face];
  const placement = rotation(axis, degrees);
  return {
    face,
    normal: transform(placement, SCREEN_FRONT),
    up: transform(placement, SCREEN_UP),
  };
});

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
  const tilt = toDegrees(Math.atan2(x, -y));
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
